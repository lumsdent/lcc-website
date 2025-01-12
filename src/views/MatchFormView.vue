<template>
  <main>
    <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-logo-blue">
      Insert a new Match Id
    </label>
    <input
      class="block w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-logo-blue dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      type="text" v-model="matchInput" placeholder="Enter match here" />

    <label class="mt-4 mb-2 block text-sm font-medium text-gray-900 dark:text-logo-blue">
      Select Blue Team
    </label>
    <select
      class="block w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-logo-blue dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      v-model="blueTeam">
      <option v-for="team in teams" :key="team" :value="team">{{ team }}</option>
    </select>

    <label class="mt-4 mb-2 block text-sm font-medium text-gray-900 dark:text-logo-blue">
      Select Red Team
    </label>
    <select
      class="block w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-logo-blue dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      v-model="redTeam">
      <option v-for="team in teams" :key="team" :value="team">{{ team }}</option>
    </select>

    <label class="mt-4 mb-2 block text-sm font-medium text-gray-900 dark:text-logo-blue">
      Enter Password
    </label>
    <input
      class="block w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-logo-blue dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      type="password" v-model="password" placeholder="Enter password" />

    <button @click="submitMatch"
      class="hover:bg-logo-blue-5 mt-4 cursor-pointer rounded bg-logo-blue px-4 py-2 font-bold text-logo-white">
      Submit
    </button>

    <div v-if="responseMessage" :class="{ 'bg-red-300 text-red-800': isError, 'bg-green-300 text-green-800': !isError }"
      class="mt-4 rounded border p-4 shadow">
      {{ responseMessage }}
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  name: 'MatchFormView',
  setup() {
    const matchInput = ref('')
    const blueTeam = ref('')
    const redTeam = ref('')
    const teams = ref([])
    const responseMessage = ref('')
    const isError = ref(false)
    const password = ref('')

    const fetchTeams = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + '/teams/3')
        const teamsArr = []
        response.data.forEach(team => {
          teamsArr.push(team.team_name)
          
        });
        console.log(teamsArr)
        teams.value = teamsArr
      } catch (error) {
        console.error('Error fetching teams:', error)
      }
    }

    const submitMatch = async () => {
      try {
        const payload = {
          matchId: matchInput.value,
          blueTeam: blueTeam.value,
          redTeam: redTeam.value,
          password: password.value
        }
        await axios.post(import.meta.env.VITE_API_URL + '/matches/add', payload)
        responseMessage.value = 'Match submitted successfully!'
        isError.value = false
      } catch (error) {
        responseMessage.value = 'Error submitting match.'
        isError.value = true
        console.error('Error submitting match:', error)
      }
    }

    onMounted(() => {
      fetchTeams()
    })

    return {
      matchInput,
      blueTeam,
      redTeam,
      teams,
      responseMessage,
      isError,
      submitMatch
    }
  }
}
</script>

<style scoped>
.loading-indicator {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #333;
}
</style>