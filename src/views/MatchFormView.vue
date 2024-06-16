<template>
  <main>
    <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-logo-blue"
      >Insert a new Match Id</label
    >
    <input
      class="block w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-logo-blue dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      type="text"
      v-model="textInput"
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
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const textInput = ref('')
const responseMessage = ref('')
const isError = ref(false)

const submitMatch = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/add_match', {
      match_id: textInput.value
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
