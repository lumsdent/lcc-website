<template>
  <div class="p-4">
    <div class="mb-4 flex flex-col items-center">
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Season:</label>
      <div class="flex space-x-2">
        <button v-for="season in seasons" :key="season" @click="selectSeason(season)" :class="{
          'bg-blue-500 text-white': season === selectedSeason,
          'bg-gray-200 text-gray-700': season !== selectedSeason
        }" class="px-4 py-2 rounded-md focus:outline-none">
          {{ season }}
        </button>
      </div>
    </div>
    <h1 class="text-2xl font-bold mb-4">Teams List</h1>
    <ul>
      <li v-for="team in teams" :key="team.team_name" class="mb-4">
        <router-link :to="`/roster/${team.team_name}`" class="text-blue-500 hover:underline">{{ team.team_name
          }}</router-link>
        <ul class="ml-4">
          <div >
            <li v-for="player in sortedPlayers(team.rosters[selectedSeason])" :key="player.player.puuid"
              class="text-gray-700">
              <span>{{ player.role }}: <router-link :to="`/players/${player.player.puuid}`">{{
                  player.player.name}}</router-link></span>
            </li>
          </div>
        </ul>
        <div>
          <button v-if="isAdmin" @click="openModal(team.team_name)"
            class="mt-2  bg-blue-500 text-white rounded-full focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </li>
    </ul>
    <!-- Add Team Button -->
    <div class="fixed bottom-4 right-4">
      <button @click="openAddTeamModal" v-if="isAdmin" class="p-4 bg-green-500 text-white rounded-full focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <p v-if="isError" class="text-red-500">{{ responseMessage }}</p>
    <!-- Add Player Modal -->
    <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Add Role and Player
                </h3>
                <div class="mt-2 flex">
                  <select v-model="newRole"
                    class="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option class="" v-for="role in roles" :key="role" :value="role">{{ role }}</option>
                  </select>
                  <select v-model="newPlayer"
                    class="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option v-for="player in availablePlayers" :key="player.profile.puuid" :value="player.profile">{{
                      player.profile.name }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="addRoleAndPlayer"  type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Add
            </button>
            <button @click="closeModal" type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Add Team Modal -->
    <div v-if="isAddTeamModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Add Team
                </h3>
                <div class="mt-2 text-black">
                  <input v-model="newTeamName" placeholder="Enter team name"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="addTeam" type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
              Add
            </button>
            <button @click="closeAddTeamModal" type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  name: 'TeamsView',
  setup() {
    const seasons = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
    const selectedSeason = ref('2')
    const teams = ref([])
    const isError = ref(false)
    const responseMessage = ref('')
    const isModalOpen = ref(false)
    const currentTeamId = ref(null)
    const roles = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT", "TOP_SUB", "JUNGLE_SUB", "MID_SUB", "ADC_SUB", "SUPPORT_SUB", "FLEX", "FLEX_SUB"]
    const availablePlayers = ref([])
    const newRole = ref('')
    const newPlayer = ref({})
    const isAddTeamModalOpen = ref(false)
    const newTeamSeason = ref('')
    const newTeamName = ref('')
    const roster = ref([])
    const isAdmin = ref(false)

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

    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/players`)
        console.log(response.data)
        availablePlayers.value = response.data
      } catch (error) {
        console.error(error)
        isError.value = true
        responseMessage.value = 'An error occurred. Please try again.'
      }
    }

    const selectSeason = (season) => {
      selectedSeason.value = season
      fetchTeams()
    }

    const sortedPlayers = (players) => {
      return players?.slice().sort((a, b) => roles.indexOf(a.lane) - roles.indexOf(b.lane))
    }

    const openModal = (teamId) => {
      currentTeamId.value = teamId
      isModalOpen.value = true
      fetchPlayers()
    }

    const closeModal = () => {
      isModalOpen.value = false
      newRole.value = ''
      newPlayer.value = ''
    }

    const openAddTeamModal = () => {
      isAddTeamModalOpen.value = true
    }

    const closeAddTeamModal = () => {
      isAddTeamModalOpen.value = false
      newTeamSeason.value = ''
      newTeamName.value = ''
    }

    const fetchUser = async () => {
      const response = await axios.get('http://localhost:5000/me/');
      const admins = await axios.get('http://localhost:5000/players/admins');
      isAdmin.value = admins.data.some(admin => admin.discord.id === response.data.id);
    }

    const addTeam = async () => {
      try {
        const response = await axios.post( `${import.meta.env.VITE_API_URL}/teams/${selectedSeason.value}/add`, {
          teamName: newTeamName.value,
          roster: roster.value
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


    const addRoleAndPlayer = async () => {
      console.log(newRole.value, newPlayer.value)
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/roster/${currentTeamId.value}/${selectedSeason.value}/add`, {
          role: newRole.value,
          player: {"puuid": newPlayer.value.puuid, "name": newPlayer.value.name}
        })
        const updatedTeam = response.data.updatedTeam
        const teamIndex = teams.value.findIndex(t => t.team_name === updatedTeam.team_name)
        if (teamIndex !== -1) {
          teams.value[teamIndex] = updatedTeam
        }
        isError.value = false
        responseMessage.value = 'Player added successfully.'
      } catch (error) {
        console.error(error)
        isError.value = true
        responseMessage.value = 'An error occurred. Please try again.'
      }
      closeModal()
    }

    onMounted(() => {
      fetchTeams();
      fetchUser();
    })

    return {
      teams,
      seasons,
      selectedSeason,
      isError,
      responseMessage,
      fetchTeams,
      selectSeason,
      sortedPlayers,
      openModal,
      closeModal,
      isModalOpen,
      roles,
      availablePlayers,
      addRoleAndPlayer,
      newRole,
      newPlayer,
      newTeamSeason,
      newTeamName,
      isAddTeamModalOpen,
      openAddTeamModal,
      closeAddTeamModal,
      addTeam,
      roster,
      isAdmin
    }
  }
}
</script>
