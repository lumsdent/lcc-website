<template>
  <main>
    <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-logo-blue"
      >Insert a new Match Id</label
    >
    <input
      class="block w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-logo-blue dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      type="text"
      v-model="matchInput"
      placeholder="Enter match here"
    />
    <button
      @click="submitMatch"
      class="hover:bg-logo-blue-5 mt-4 cursor-pointer rounded bg-logo-blue px-4 py-2 font-bold text-logo-white"
    >
      Submit
    </button>
    <div
      v-if="responseMessage"
      :class="{ 'bg-red-300 text-red-800': isError, 'bg-green-300 text-green-800': !isError }"
      class="mt-4 rounded border p-4 shadow"
    >
      {{ responseMessage }}
    </div>

 
    <input
      class="block w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-logo-blue dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      type="text"
      v-model="teamInput"
      placeholder="Enter match here"
    />
    <button
      @click="submitTeam"
      class="hover:bg-logo-blue-5 mt-4 cursor-pointer rounded bg-logo-blue px-4 py-2 font-bold text-logo-white"
    >
      Add Team
    </button>
    <div
      v-if="responseMessage"
      :class="{ 'bg-red-300 text-red-800': isError, 'bg-green-300 text-green-800': !isError }"
      class="mt-4 rounded border p-4 shadow"
    >
      {{ responseMessage }}
    </div>
  </main>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

const matchInput = ref('')
const teamInput = ref('')
const responseMessage = ref('')
const isError = ref(false)

const submitMatch = async () => {
  try {
    const response = await axios.post(import.meta.env.VITE_API_URL + '/matches/add', {
      match_id: matchInput.value
    })
    responseMessage.value = response.data.message
    isError.value = false
  } catch (error) {
    console.error(error)
    isError.value = true
    responseMessage.value = 'An error occurred. Please try again.'
  }
}

const submitTeam = async () => {
  try {
    const response = await axios.post(import.meta.env.VITE_API_URL + '/teams/2/add', {
      team_name: teamInput.value
    })
    responseMessage.value = response.data.message
    isError.value = false
  } catch (error) {
    console.error(error)
    isError.value = true
    responseMessage.value = 'An error occurred. Please try again.'
  }
}
</script>
