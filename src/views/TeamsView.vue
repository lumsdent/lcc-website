<template>
  <div class="p-6 max-w-7xl mx-auto">

    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white mb-2">Teams</h1>
      <p class="text-gray-400">{{ filteredTeams.length }} team{{ filteredTeams.length !== 1 ? 's' : '' }}
        <span v-if="seasonFilter !== null"> in Season {{ seasonFilter }}</span>
      </p>
    </div>

    <!-- Season Filter -->
    <div class="mb-8 flex flex-wrap justify-center gap-2">
      <button
        @click="seasonFilter = null"
        :class="seasonFilter === null
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
        class="px-4 py-1.5 rounded-full border text-sm font-medium transition-colors"
      >
        All Seasons
      </button>
      <button
        v-for="s in availableSeasonNumbers"
        :key="s"
        @click="seasonFilter = s"
        :class="seasonFilter === s
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
        class="px-4 py-1.5 rounded-full border text-sm font-medium transition-colors"
      >
        Season {{ s }}
      </button>
    </div>

    <!-- Teams Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="team in filteredTeams"
        :key="team.id"
        :to="`/teams/${team.id}`"
        class="group block rounded-xl overflow-hidden bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-500 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
      >
        <!-- Color accent bar -->
        <div class="h-1 w-full" :style="{ backgroundColor: team.primaryColor }"></div>

        <div class="p-5 flex flex-col items-center text-center">
          <!-- Team Logo -->
          <div class="w-24 h-24 mb-4 flex items-center justify-center">
            <TeamLogo
              :teamName="team.displayName"
              :season="seasonFilter"
              class="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          <!-- Team Name -->
          <h2 class="text-white font-bold text-base leading-tight mb-1 group-hover:text-blue-300 transition-colors">
            {{ team.displayName }}
          </h2>

          <!-- Former Name — only shown when the card is using the current name -->
          <p v-if="team.formerName && team.displayName === team.name" class="text-gray-500 text-xs mb-2">
            fmr. {{ team.formerName }}
          </p>

          <!-- Tricode + Est -->
          <div class="flex items-center gap-2 mt-1">
            <span
              class="px-2 py-0.5 rounded text-xs font-mono font-bold text-white"
              :style="{ backgroundColor: team.primaryColor + '55', border: '1px solid ' + team.primaryColor }"
            >
              {{ team.tricode }}
            </span>
            <span class="text-gray-500 text-xs">Est. {{ team.established }}</span>
          </div>

          <!-- Season badges -->
          <div v-if="team.seasons && team.seasons.length" class="flex flex-wrap justify-center gap-1 mt-3">
            <span
              v-for="s in team.seasons"
              :key="s.season"
              class="px-1.5 py-0.5 bg-gray-700 text-gray-400 text-xs rounded"
            >
              S{{ s.season }}
            </span>
          </div>
          <div v-else class="mt-3">
            <span class="text-gray-600 text-xs italic">No seasons recorded</span>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Empty state -->
    <div v-if="filteredTeams.length === 0" class="text-center py-16 text-gray-500">
      No teams found for Season {{ seasonFilter }}.
    </div>

    <!-- Admin Actions -->
    <div v-if="authStore.isAdmin" class="flex justify-end mt-8 gap-3">
      <button
        @click="openAssignPlayerModal(null, '')"
        class="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
        </svg>
        Assign Player
      </button>
      <button
        @click="openAddTeamModal"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/>
        </svg>
        Add Team
      </button>
    </div>

    <!-- Player Assignment Modal -->
    <div v-if="isAssignModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-gray-800 border border-gray-700 p-6 rounded-xl max-w-md w-full mx-4">
        <h3 class="text-lg text-white font-bold mb-4">Assign Player to Roster</h3>

        <!-- Season selector for admin -->
        <label class="block text-sm font-medium text-gray-400 mb-1">Season</label>
        <select v-model="selectedSeason" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mb-4 text-white">
          <option v-for="season in seasons" :key="season.id" :value="season.id">{{ season.name }}</option>
        </select>

        <!-- Team selector -->
        <label class="block text-sm font-medium text-gray-400 mb-1">Team</label>
        <select v-model="selectedTeam" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mb-4 text-white">
          <option value="">Select a team</option>
          <option v-for="team in teamsForSelectedSeason" :key="team.team_name" :value="{ team_name: team.team_name }">{{ team.team_name }}</option>
        </select>

        <!-- Role selector -->
        <label class="block text-sm font-medium text-gray-400 mb-1">Role</label>
        <select v-model="selectedRole" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mb-4 text-white">
          <option value="">Select a role</option>
          <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
        </select>

        <!-- Player selector -->
        <label class="block text-sm font-medium text-gray-400 mb-1">Player</label>
        <select v-model="selectedPlayer" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mb-4 text-white">
          <option value="">Select a player</option>
          <option v-for="player in availablePlayers" :key="player.profile.puuid" :value="player">
            {{ player.profile.name }}
          </option>
        </select>

        <div class="flex justify-end gap-2">
          <button @click="closeAssignModal" class="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700">Cancel</button>
          <button @click="assignPlayer" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Assign</button>
        </div>
      </div>
    </div>

    <!-- Add Team Modal -->
    <div v-if="isAddTeamModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-gray-800 border border-gray-700 p-6 rounded-xl max-w-md w-full mx-4">
        <h3 class="text-lg text-white font-bold mb-4">Add New Team</h3>

        <!-- Season selector for admin -->
        <label class="block text-sm font-medium text-gray-400 mb-1">Season</label>
        <select v-model="selectedSeason" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mb-4 text-white">
          <option v-for="season in seasons" :key="season.id" :value="season.id">{{ season.name }}</option>
        </select>

        <label class="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
        <input class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mb-4 text-white" v-model="newTeamName" placeholder="Enter Team Name" />

        <label class="block text-sm font-medium text-gray-400 mb-2">Team Image</label>
        <div class="grid grid-cols-3 gap-3 mb-4 max-h-48 overflow-y-auto">
          <div
            v-for="image in teamImages"
            :key="image"
            @click="selectedImage = image"
            class="cursor-pointer p-2 border rounded-md bg-gray-700 transition-colors"
            :class="selectedImage === image ? 'border-blue-500' : 'border-gray-600 hover:border-gray-400'"
          >
            <img :src="getTeamImage(image)" :alt="image" class="w-full h-16 object-contain" />
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button @click="closeAddTeamModal" class="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700">Cancel</button>
          <button @click="addTeam" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Add Team</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { SEASONS } from '@/config.js'
import { useAuthStore } from '@/stores/auth.js'
import teamsDataJson from '@/data/teamsData.json'
import TeamLogo from '@/components/TeamLogo.vue'

export default {
  name: 'TeamsView',
  components: { TeamLogo },
  setup() {
    const authStore = useAuthStore()
    const roles = ['TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT']
    const staticTeams = teamsDataJson.teams

    // API-fetched roster data: maps team_name -> sorted array of season numbers
    const apiTeamRosters = ref({})

    // Merge API roster seasons into static team data so season badges and
    // filtering reflect the actual rosters in the database, not only what
    // is stored in the local JSON.  Season values are normalised to strings
    // here so comparisons downstream never need String() wrappers.
    // Each season entry is tagged with the name the team used that season
    // (former name or current name) since the API stores them separately.
    const allTeams = computed(() => {
      return staticTeams.map(team => {
        const currentApiSeasons = apiTeamRosters.value[team.name]
        const formerApiSeasons = team.formerName ? apiTeamRosters.value[team.formerName] : undefined

        let seasons
        if (currentApiSeasons !== undefined || formerApiSeasons !== undefined) {
          const current = (currentApiSeasons || []).map(s => ({ season: String(s), nameUsed: team.name }))
          const former = (formerApiSeasons || []).map(s => ({ season: String(s), nameUsed: team.formerName }))
          seasons = [...former, ...current].sort((a, b) =>
            a.season.localeCompare(b.season, undefined, { numeric: true })
          )
        } else {
          seasons = team.seasons.map(s => ({ ...s, season: String(s.season), nameUsed: team.name }))
        }

        return { ...team, seasons }
      })
    })

    // Season filter for the view (null = all)
    const seasonFilter = ref(null)

    // Derived from the merged (API-aware) team list
    const availableSeasonNumbers = computed(() => [
      ...new Set(allTeams.value.flatMap(t => t.seasons.map(s => s.season)))
    ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })))

    // Filtered team list — also sets displayName to the name used that season
    const filteredTeams = computed(() => {
      const teams = seasonFilter.value === null
        ? allTeams.value
        : allTeams.value.filter(t => t.seasons.some(s => s.season === seasonFilter.value))

      return teams.map(t => {
        const seasonEntry = seasonFilter.value !== null
          ? t.seasons.find(s => s.season === seasonFilter.value)
          : null
        return { ...t, displayName: seasonEntry?.nameUsed ?? t.name }
      })
    })

    // Admin state
    const isAssignModalOpen = ref(false)
    const isAddTeamModalOpen = ref(false)
    const selectedTeam = ref(null)
    const selectedRole = ref('')
    const selectedPlayer = ref('')
    const availablePlayers = ref([])
    const selectedSeason = ref('4')
    const teamsForSelectedSeason = ref([])
    const newTeamName = ref('')
    const teamImages = ref([])
    const selectedImage = ref('')

    const getTeamImage = (imageName) => {
      return new URL(`../assets/teams/${imageName}`, import.meta.url).href
    }

    onMounted(async () => {
      const images = import.meta.glob('../assets/teams/*')
      teamImages.value = Object.keys(images).map(path => path.split('/').pop())

      // Fetch authoritative roster data from the API so season badges and
      // filters reflect what is actually stored in the database.
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/teams/all`)
        const rosterMap = {}
        for (const apiTeam of response.data) {
          rosterMap[apiTeam.team_name] = Object.keys(apiTeam.rosters || {}).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        }
        apiTeamRosters.value = rosterMap
      } catch (error) {
        console.error('Error fetching team rosters from API:', error)
      }
    })

    const openAssignPlayerModal = (team, role) => {
      selectedTeam.value = team
      selectedRole.value = role
      isAssignModalOpen.value = true
      fetchAvailablePlayers()
      fetchTeamsForSeason(selectedSeason.value)
    }

    const closeAssignModal = () => {
      isAssignModalOpen.value = false
      selectedTeam.value = null
      selectedRole.value = ''
      selectedPlayer.value = ''
    }

    const assignPlayer = async () => {
      if (!selectedPlayer.value || !selectedTeam.value) return
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/roster/assign`, {
          teamName: selectedTeam.value.team_name,
          role: selectedRole.value,
          player: { puuid: selectedPlayer.value.profile.puuid, name: selectedPlayer.value.profile.name },
          season: selectedSeason.value,
        }, { withCredentials: true })
        closeAssignModal()
      } catch (error) {
        console.error('Error assigning player:', error)
      }
    }

    const openAddTeamModal = () => {
      isAddTeamModalOpen.value = true
    }

    const closeAddTeamModal = () => {
      isAddTeamModalOpen.value = false
      newTeamName.value = ''
      selectedImage.value = ''
    }

    const addTeam = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/teams/${selectedSeason.value}/add`, {
          teamName: newTeamName.value,
          image: selectedImage.value,
        }, { withCredentials: true })
      } catch (error) {
        console.error(error)
      }
      closeAddTeamModal()
    }

    const fetchAvailablePlayers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/players`)
        availablePlayers.value = response.data
          .sort((a, b) => a.profile.name.localeCompare(b.profile.name))
      } catch (error) {
        console.error('Error fetching available players:', error)
      }
    }

    const fetchTeamsForSeason = async (season) => {
      if (!season) return
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/teams/${season}`)
        teamsForSelectedSeason.value = response.data
      } catch (error) {
        console.error('Error fetching teams for season:', error)
        teamsForSelectedSeason.value = []
      }
    }

    watch(selectedSeason, (newSeason) => {
      // Reset selected team whenever the season changes so a stale value isn't submitted
      selectedTeam.value = null
      fetchTeamsForSeason(newSeason)
    })

    return {
      roles,
      allTeams,
      filteredTeams,
      seasonFilter,
      availableSeasonNumbers,
      isAssignModalOpen,
      selectedTeam,
      selectedRole,
      selectedSeason,
      selectedPlayer,
      availablePlayers,
      teamsForSelectedSeason,
      openAssignPlayerModal,
      closeAssignModal,
      assignPlayer,
      getTeamImage,
      openAddTeamModal,
      closeAddTeamModal,
      isAddTeamModalOpen,
      addTeam,
      newTeamName,
      teamImages,
      selectedImage,
      seasons: SEASONS,
      authStore,
    }
  }
}
</script>