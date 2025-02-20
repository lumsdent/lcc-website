<template>
  <div class="p-4">
    <!-- Season selector remains the same -->
    <div class="mb-4 flex flex-col items-center">
      <!-- ...existing season selection code... -->
    </div>

    <div class="container mx-auto">
      <table class="w-full border-collapse">
        <tbody>
          <tr v-for="team in teams" :key="team.team_name" class="border-b">
            <!-- Left Column: Team Info -->
            <td class="p-4 w-1/3">
              <div class="flex flex-col items-center">
                <h3 class="text-xl font-bold p-4">{{ team.team_name }}</h3>
                <img v-if="team.image" :src="getTeamImage(team.image)" :alt="team.team_name"
                  class="w-32 h-32 object-contain mb-2" />
              </div>
            </td>

            <!-- Right Column: Roster Table -->
            <td class="p-4 w-2/3">
              <table class="w-full border-collapse">
                <thead>
                  <tr>
                    <th class="border p-2 w-1/2">Role</th>
                    <th class="border p-2 w-1/2">Player</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="role in roles" :key="role" class="border">
                    <td class="border p-2">{{ role }}</td>
                    <td class="border p-2">
                      <div class="flex justify-between items-center">
                        <span v-if="getPlayerForRole(team, role)">
                          <router-link :to="`/players/${getPlayerForRole(team, role).puuid}`"
                            class="text-blue-500 hover:underline">
                            {{ getPlayerForRole(team, role).name }}
                          </router-link>
                        </span>
                        <button @click="openAssignPlayerModal(team, role)"
                          class="bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                          {{ getPlayerForRole(team, role) ? 'Change' : 'Assign' }}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Team Button -->
    <div class="flex justify-end mt-4">
      <button @click="openAddTeamModal" class="p-4 bg-blue-500 text-white rounded-full focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Player Assignment Modal -->
    <div v-if="isAssignModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-4 rounded-lg max-w-md w-full">
        <h3 class="text-lg text-logo-blue font-bold mb-4">
          Assign Player to {{ selectedRole }} for {{ selectedTeam?.team_name }}
        </h3>
        <select v-model="selectedPlayer" class="w-full p-2 border rounded-md mb-4 text-black">
          <option value="">Select a player</option>
          <option v-for="player in availablePlayers" :key="player.profile.puuid" :value="player">
            {{ player.profile.name }}
          </option>
        </select>
        <label class="mt-4 mb-2 block text-sm font-medium text-gray-900 dark:text-logo-blue">
          Enter Password
        </label>
        <input class="w-full p-2 border rounded-md mb-4 text-black" type="password" v-model="password"
          placeholder="Enter password" />

        <div class="flex justify-end space-x-2">
          <button @click="closeAssignModal" class="px-4 py-2 border rounded-md text-black">
            Cancel
          </button>
          <button @click="assignPlayer" class="px-4 py-2 bg-blue-500 text-white rounded-md">
            Assign
          </button>
        </div>
      </div>
    </div>

    <div v-if="isAddTeamModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-4 rounded-lg max-w-md w-full">
        <h3 class="text-lg text-logo-blue font-bold mb-4">
          Add New Team to Season {{ selectedSeason }}
        </h3>
        <label class="mt-4 mb-2 block text-sm font-medium text-gray-900 dark:text-logo-blue">
          Enter Team Name
        </label>
        <input class="w-full p-2 border rounded-md mb-4 text-black" v-model="newTeamName"
          placeholder="Enter Team Name" />
        
        <!-- Team Image Selection -->
        <label class="mt-4 mb-2 block text-sm font-medium text-logo-blue">
          Select Team Image
        </label>
        <div class="grid grid-cols-3 gap-4 mb-4 max-h-48 overflow-y-auto">
          <div v-for="image in teamImages" :key="image" @click="selectedImage = image"
            class="cursor-pointer p-2 border rounded-md" :class="{ 'border-blue-500': selectedImage === image }">
            <img :src="getTeamImage(image)" :alt="image" class="w-full h-20 object-contain" />
          </div>
        </div>

        <label class="mt-4 mb-2 block text-sm font-medium text-gray-900 dark:text-logo-blue">
          Enter Password
        </label>
        <input class="w-full p-2 border rounded-md mb-4 text-black" type="password" v-model="password"
          placeholder="Enter password" />

        <div class="flex justify-end space-x-2">
          <button @click="closeAddTeamModal" class="px-4 py-2 border rounded-md text-black">
            Cancel
          </button>
          <button @click="addTeam" class="px-4 py-2 bg-blue-500 text-white rounded-md">
            Add
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'TeamsView',
  setup() {
    const roles = ['TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT']
    const isAssignModalOpen = ref(false)
    const isAddTeamModalOpen = ref(false)
    const selectedTeam = ref(null)
    const selectedRole = ref('')
    const selectedPlayer = ref('')
    const availablePlayers = ref([])
    const selectedSeason = ref('3')
    const teams = ref([])
    const isError = ref(false)
    const responseMessage = ref('')
    const password = ref('')
    const newTeamName = ref('')
    const teamImages = ref([])
    const selectedImage = ref('')

    const getPlayerForRole = (team, role) => {
      const playersInRole = team.rosters[selectedSeason.value]?.filter(player => player.role === role);
      return playersInRole?.[playersInRole.length - 1];
    }

    const openAssignPlayerModal = (team, role) => {
      selectedTeam.value = team
      selectedRole.value = role
      isAssignModalOpen.value = true
      // Fetch available players
      fetchAvailablePlayers()
    }

    const closeAssignModal = () => {
      isAssignModalOpen.value = false
      selectedTeam.value = null
      selectedRole.value = ''
      selectedPlayer.value = ''
    }

    const getTeamImage = (imageName) => {
      return new URL(`../assets/teams/${imageName}`, import.meta.url).href
    }

    onMounted(() => {
      fetchTeams();
      const images = import.meta.glob('../assets/teams/*')
      teamImages.value = Object.keys(images).map(path => {
        return path.split('/').pop()})
      // fetchUser();
    })

    const assignPlayer = async () => {
      if (!selectedPlayer.value) return

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/roster/assign`, {
          teamName: selectedTeam.value.team_name,
          role: selectedRole.value,
          player: { "puuid": selectedPlayer.value.profile.puuid, "name": selectedPlayer.value.profile.name },
          season: selectedSeason.value,
          password: password.value
        })
        // Refresh teams data
        await fetchTeams()
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
    }

    const addTeam = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/teams/${selectedSeason.value}/add`, {
          teamName: newTeamName.value,
          image: selectedImage.value,
          password: password.value
        })
        teams.value = fetchTeams()
        isError.value = false
        responseMessage.value = response.data.message
      } catch (error) {
        console.error(error)
        isError.value = true
        responseMessage.value = 'An error occurred. Please try again.'
      }
      closeAddTeamModal()
    }


    const fetchTeams = async () => {
      try {

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/teams/${selectedSeason.value}`)
        console.log(response.data)
        teams.value = response.data
        isError.value = false
      } catch (error) {
        console.error(error)
        isError.value = true
        responseMessage.value = 'An error occurred. Please try again.'
      }
    }

    const fetchAvailablePlayers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/players`)
        console.log(response.data)
        const players = response.data
        availablePlayers.value = players.filter(player => player.profile.is_active)
      } catch (error) {
        console.error('Error fetching available players:', error)
      }
    }

    return {
      roles,
      isAssignModalOpen,
      selectedTeam,
      selectedRole,
      selectedSeason,
      selectedPlayer,
      availablePlayers,
      getPlayerForRole,
      openAssignPlayerModal,
      closeAssignModal,
      assignPlayer,
      teams,
      getTeamImage,
      password,
      openAddTeamModal,
      closeAddTeamModal,
      isAddTeamModalOpen,
      addTeam,
      newTeamName,
      teamImages,
      selectedImage
    }
  }
}
</script>