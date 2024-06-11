<template>
  <main class="mx-auto max-w-md p-4">
    <h1 class="text-logo-blue mb-4 text-center text-xl font-semibold">Practice</h1>
    <form v-if="!preMatchFormSubmitted" @submit.prevent="submitForm" class="flex flex-col gap-4">
      <h2 class="text-l mb-4 text-center font-semibold">
        Fill this part of the form out prior to your match. When you are finished, click submit to
        be taken to the post match evaluation form.
      </h2>
      <label
        for="summonerName"
        class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
        >Summoner Name</label
      >
      <div class="flex">
        <span
          class="rounded-e-0 inline-flex items-center rounded-s-md border border-e-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
        >
          <svg
            class="h-4 w-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"
            />
          </svg>
        </span>
        <input
          type="text"
          id="summonerName"
          class="block w-full min-w-0 flex-1 rounded-none rounded-e-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>

      <label for="tag" class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
        >Tag</label
      >
      <div class="flex">
        <span
          class="rounded-e-0 inline-flex items-center rounded-s-md border border-e-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
        >
          <svg
            class="h-4 w-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10.1104 2.00608C10.6593 2.06707 11.0548 2.56149 10.9938 3.1104L10.4506 8H14.4383L15.0061 2.88953C15.0671 2.34063 15.5615 1.94509 16.1104 2.00608C16.6593 2.06707 17.0548 2.56149 16.9938 3.1104L16.4506 8H20C20.5523 8 21 8.44772 21 9C21 9.55228 20.5523 10 20 10H16.2283L15.7839 14H20C20.5523 14 21 14.4477 21 15C21 15.5523 20.5523 16 20 16H15.5617L14.9938 21.1104C14.9329 21.6593 14.4384 22.0548 13.8895 21.9938C13.3406 21.9329 12.9451 21.4384 13.0061 20.8895L13.5494 16H9.56167L8.99385 21.1104C8.93286 21.6593 8.43844 22.0548 7.88953 21.9938C7.34063 21.9329 6.94509 21.4384 7.00608 20.8895L7.54936 16H4C3.44772 16 3 15.5523 3 15C3 14.4477 3.44772 14 4 14H7.77159L8.21603 10H4C3.44772 10 3 9.55228 3 9C3 8.44772 3.44772 8 4 8H8.43825L9.00608 2.88953C9.06707 2.34063 9.56149 1.94509 10.1104 2.00608ZM13.7716 14L14.216 10H10.2283L9.78389 14H13.7716Z"
            />
          </svg>
        </span>
        <input
          type="text"
          id="tag"
          class="block w-full min-w-0 flex-1 rounded-none rounded-e-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>

      <div class="flex flex-col gap-2">
        <span class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
          >Queue Type:</span
        >
        <div>
          <input
            type="radio"
            id="solo"
            name="queueType"
            value="solo"
            class="peer hidden"
            v-model="preMatch.gameMode"
          />
          <label
            for="solo"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Solo Ranked</label
          >
        </div>
        <div>
          <input
            type="radio"
            id="duo"
            name="queueType"
            value="duo"
            class="peer hidden"
            v-model="preMatch.gameMode"
          />
          <label
            for="duo"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Duo Ranked</label
          >
        </div>
        <div>
          <input
            type="radio"
            id="flex"
            name="queueType"
            value="flex"
            class="peer hidden"
            v-model="preMatch.gameMode"
          />
          <label
            for="flex"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Flex Ranked</label
          >
        </div>
        <div>
          <input
            type="radio"
            id="normal"
            name="queueType"
            value="normal"
            class="peer hidden"
            v-model="preMatch.gameMode"
          />
          <label
            for="normal"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Normal Draft</label
          >
        </div>
      </div>

      <span class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900">Lane:</span>
      <div class="flex flex-col gap-2">
        <div>
          <input type="radio" id="top" name="primaryRole" value="top" class="peer hidden" />
          <label
            for="top"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Top</label
          >
        </div>
        <div>
          <input type="radio" id="jungle" name="primaryRole" value="jungle" class="peer hidden" />
          <label
            for="jungle"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Jungle</label
          >
        </div>
        <div>
          <input type="radio" id="mid" name="primaryRole" value="mid" class="peer hidden" />
          <label
            for="mid"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Mid</label
          >
        </div>
        <div>
          <input type="radio" id="adc" name="primaryRole" value="adc" class="peer hidden" />
          <label
            for="adc"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >ADC</label
          >
        </div>
        <div>
          <input type="radio" id="support" name="primaryRole" value="support" class="peer hidden" />
          <label
            for="support"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Support</label
          >
        </div>
      </div>
      <span class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
        >Your Champion:</span
      >
      <div class="form-control">
        <select
          v-model="preMatch.myChampion"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          <option v-for="champion in champions" :key="champion.id" :value="champion.id">
            {{ champion.name }}
          </option>
        </select>
      </div>

      <span class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
        >Lane Matchup:</span
      >
      <div class="form-control">
        <select
          v-model="preMatch.opponentChampion"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          <option v-for="champion in champions" :key="champion.id" :value="champion.id">
            {{ champion.name }}
          </option>
        </select>
      </div>
      <div>
        <label class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900" for="reason"
          >What is your practice goal for this match?</label
        >
        <textarea
          id="goal"
          name="goal"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          v-model="preMatch.goal"
        ></textarea>
      </div>

      <input
        type="submit"
        value="Continue to Post Match Evaluation"
        class="bg-logo-blue text-logo-white hover:bg-logo-blue-5 mt-4 cursor-pointer rounded px-4 py-2 font-bold"
      />
    </form>
    <form v-else @submit.prevent="handleSubmit">
      <h2 class="text-l mb-4 text-center font-semibold">Complete this form following your match</h2>
      <div class="flex flex-col gap-2">
        <span class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
          >Match Result:</span
        >
        <div>
          <input
            type="radio"
            id="won"
            name="result"
            value="won"
            class="peer hidden"
            v-model="postMatch.result"
          />
          <label
            for="won"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Won</label
          >
        </div>
        <div>
          <input
            type="radio"
            id="loss"
            name="result"
            value="loss"
            class="peer hidden"
            v-model="postMatch.result"
          />
          <label
            for="loss"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
            >Loss</label
          >
        </div>
      </div>

      <div>
        <label class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900" for="lesson"
          >What did you learn?</label
        >
        <textarea
          id="lesson"
          name="lesson"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          v-model="postMatch.lesson"
        ></textarea>
      </div>

      <div class="relative mb-6">
        <label
          for="focus-range"
          class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
          >Focus Rating</label
        >
        <input
          id="focus-range"
          type="range"
          min="1"
          max="5"
          value="1"
          step="1"
          class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
          v-model="postMatch.focus"
        />
        <span class="absolute -bottom-6 start-0 text-sm text-gray-500 dark:text-gray-400">1</span>
        <span
          class="absolute -bottom-6 start-1/4 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400"
          >2</span
        >
        <span
          class="absolute -bottom-6 start-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400"
          >3</span
        >
        <span class="absolute -bottom-6 end-1/4 text-sm text-gray-500 dark:text-gray-400">4</span>
        <span class="absolute -bottom-6 end-0 text-sm text-gray-500 dark:text-gray-400">5</span>
      </div>

      <div class="relative mb-6">
        <label
          for="performance-range"
          class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
          >Performance Rating</label
        >
        <input
          id="performance-range"
          type="range"
          min="1"
          max="5"
          value="1"
          step="1"
          class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
          v-model="postMatch.performance"
        />
        <span class="absolute -bottom-6 start-0 text-sm text-gray-500 dark:text-gray-400">1</span>
        <span
          class="absolute -bottom-6 start-1/4 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400"
          >2</span
        >
        <span
          class="absolute -bottom-6 start-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400"
          >3</span
        >
        <span class="absolute -bottom-6 end-1/4 text-sm text-gray-500 dark:text-gray-400">4</span>
        <span class="absolute -bottom-6 end-0 text-sm text-gray-500 dark:text-gray-400">5</span>
      </div>

      <div class="relative mb-6">
        <label
          for="mental-range"
          class="dark:text-logo-blue mb-2 block text-sm font-medium text-gray-900"
          >Mental Rating</label
        >
        <input
          id="mental-range"
          type="range"
          min="1"
          max="5"
          value="1"
          step="1"
          class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
          v-model="postMatch.mental"
        />
        <span class="absolute -bottom-6 start-0 text-sm text-gray-500 dark:text-gray-400">1</span>
        <span
          class="absolute -bottom-6 start-1/4 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400"
          >2</span
        >
        <span
          class="absolute -bottom-6 start-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400"
          >3</span
        >
        <span class="absolute -bottom-6 end-1/4 text-sm text-gray-500 dark:text-gray-400">4</span>
        <span class="absolute -bottom-6 end-0 text-sm text-gray-500 dark:text-gray-400">5</span>
      </div>

      <input
        type="submit"
        value="Submit Practice Evaluation"
        class="bg-logo-blue text-logo-white hover:bg-logo-blue-5 mt-4 cursor-pointer rounded px-4 py-2 font-bold"
      />
    </form>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      champions: [],
      preMatchFormSubmitted: false,
      preMatch: {
        summonerName: '',
        tag: '',
        goal: '',
        gameMode: '',
        lane: '',
        myChampion: null,
        opponentChampion: null
      },
      postMatch: {
        lesson: ''
      }
    }
  },
  methods: {
    submitForm() {
      this.preMatchFormSubmitted = true
      // Handle form submission here
    },
    async handleSubmit() {
      const combinedData = { ...this.preMatch, ...this.postMatch }
      console.log(combinedData)
    }
  },
  async created() {
    const response = await axios.get(
      'https://ddragon.leagueoflegends.com/cdn/11.22.1/data/en_US/champion.json'
    )
    this.champions = Object.values(response.data.data)
  }
}
</script>
