<template>
  <div class="mx-auto max-w-md p-4">

    <!-- Closed banner -->
    <div v-if="!isRegistrationOpen" class="flex flex-col items-center text-center py-16 gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6V7m0 0a4 4 0 00-4 4v1H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2v-1a4 4 0 00-4-4z" />
      </svg>
      <h2 class="text-xl font-bold text-white">Registration is Closed</h2>
      <p class="text-gray-400 max-w-xs">Registration for the current season has ended. Check back next year to sign up for the LCC!</p>
      <div class="mt-4 rounded-lg bg-gray-800 border border-gray-700 p-5 text-left max-w-sm w-full">
        <h3 class="text-white font-semibold mb-2">Already registered? Keep your profile up to date</h3>
        <ol class="text-gray-400 text-sm space-y-1 list-decimal list-inside">
          <li>Go to the <router-link to="/players" class="text-blue-400 hover:underline">Players</router-link> page</li>
          <li>Find and open your player profile</li>
          <li>Click the <span class="text-white font-medium">Refresh</span> button to sync your latest Riot data</li>
        </ol>
        <p class="text-gray-500 text-xs mt-3">Profiles can be refreshed once every 24 hours.</p>
      </div>
      <div class="rounded-lg bg-gray-800 border border-gray-700 p-5 text-left max-w-sm w-full">
        <h3 class="text-white font-semibold mb-1">Join the community</h3>
        <p class="text-gray-400 text-sm">Stay connected, get updates, and chat with other players on our
          <a href="https://discord.gg/bdn4A7FmdW" target="_blank" rel="noopener noreferrer" class="text-logo-blue hover:underline">Discord server</a>.
        </p>
      </div>
      <div class="rounded-lg bg-gray-800 border border-gray-700 p-5 text-left max-w-sm w-full">
        <h3 class="text-white font-semibold mb-1">Watch the games</h3>
        <p class="text-gray-400 text-sm">Check out the <router-link to="/schedule" class="text-logo-blue hover:underline">Schedule</router-link> for all upcoming and past games this season.</p>
      </div>
    </div>

    <!-- Open form -->
    <template v-else>
    <ResponseBox :message="responseMessage" :isSuccess="!isError" />
    <h2 class="text-l mb-4 text-center font-semibold">
      Please fill out the form if you are interested in joining the LCC
    </h2>
    <form @submit.prevent="submitForm" class="flex flex-col gap-4">
      <label for="summonerName" class="text-logo-blue mb-2 block text-sm font-medium">Summoner
        Name</label>
      <div class="flex">
        <span
          class="rounded-e-0 inline-flex items-center rounded-s-md border border-e-0  px-3 text-sm  border-gray-600 bg-gray-700 text-gray-400">
          <svg class="h-4 w-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
            viewBox="0 0 20 20">
            <path
              d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </span>
        <input type="text" id="summonerName" v-model="player.name"
          class="text-logo-blue block w-full min-w-0 flex-1 rounded-none rounded-e-lg border  p-2.5 text-sm border-gray-600 bg-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <label for="tag" class="text-logo-blue mb-2 block text-sm font-medium ">Tag</label>
      <div class="flex">
        <span
          class="rounded-e-0 inline-flex items-center rounded-s-md border border-e-0   px-3 text-sm  border-gray-600 bg-gray-700 text-gray-400">
          <svg class="h-4 w-4  text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
            viewBox="0 0 20 20">
            <path
              d="M10.1104 2.00608C10.6593 2.06707 11.0548 2.56149 10.9938 3.1104L10.4506 8H14.4383L15.0061 2.88953C15.0671 2.34063 15.5615 1.94509 16.1104 2.00608C16.6593 2.06707 17.0548 2.56149 16.9938 3.1104L16.4506 8H20C20.5523 8 21 8.44772 21 9C21 9.55228 20.5523 10 20 10H16.2283L15.7839 14H20C20.5523 14 21 14.4477 21 15C21 15.5523 20.5523 16 20 16H15.5617L14.9938 21.1104C14.9329 21.6593 14.4384 22.0548 13.8895 21.9938C13.3406 21.9329 12.9451 21.4384 13.0061 20.8895L13.5494 16H9.56167L8.99385 21.1104C8.93286 21.6593 8.43844 22.0548 7.88953 21.9938C7.34063 21.9329 6.94509 21.4384 7.00608 20.8895L7.54936 16H4C3.44772 16 3 15.5523 3 15C3 14.4477 3.44772 14 4 14H7.77159L8.21603 10H4C3.44772 10 3 9.55228 3 9C3 8.44772 3.44772 8 4 8H8.43825L9.00608 2.88953C9.06707 2.34063 9.56149 1.94509 10.1104 2.00608ZM13.7716 14L14.216 10H10.2283L9.78389 14H13.7716Z" />
          </svg>
        </span>
        <input type="text" id="tag" v-model="player.tag"
          class="text-logo-blue block w-full min-w-0 flex-1 rounded-none rounded-e-lg border p-2.5 text-sm  border-gray-600 bg-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <div>
        <label class="text-logo-blue mb-2 block text-sm font-medium " for="email">Email:</label>
        <input type="email" id="email" name="email" v-model="player.email"
          class="text-logo-blue block w-full min-w-0 flex-1 rounded-lg border p-2.5 text-sm  border-gray-600 bg-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" />
      </div>

      <p class="text-logo-blue mb-2 block text-sm font-medium ">Primary Role:</p>
      <div class="flex flex-col gap-2">
        <div v-for="role in roles" :key="role">
          <input type="radio" :id="role" name="primaryRole" :value="role" v-model="player.primaryRole"
            class="peer hidden" />
          <label :for="role"
            class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border   p-3    peer-checked:border-blue-600  border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300 peer-checked:text-blue-500">{{
            role.charAt(0).toUpperCase() + role.slice(1) }}</label>
        </div>
      </div>
      <p class="text-logo-blue mb-2 block text-sm font-medium ">Secondary Role:</p>
      <div class="flex flex-col gap-2">
        <div v-for="role in roles" :key="`secondary-${role}`">
          <input type="radio" :id="`secondary-${role}`" name="secondaryRole" :value="role"
            v-model="player.secondaryRole" class="peer hidden" />
          <label :for="`secondary-${role}`" class="inline-flex w-full cursor-pointer items-center justify-between
            rounded-lg border p-3 peer-checked:border-blue-600 border-gray-700 bg-gray-800 text-gray-400
            hover:bg-gray-700 hover:text-gray-300 peer-checked:text-blue-500">{{
            role }}</label>
        </div>
      </div>

      <div>
        <label class="text-logo-blue mb-2 block text-sm font-medium ">Common Availability for Practice:</label>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="day in days" :key="day">
            <label class="block text-sm font-medium  text-logo-blue">{{ day }}</label>
            <div class="flex items-center">
              <input type="checkbox" :id="`${day}-morning`" v-model="player.availability[day].morning"
                class="form-checkbox" />
              <label :for="`${day}-morning`" class="ml-2 text-sm  text-logo-blue">Morning</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" :id="`${day}-evening`" v-model="player.availability[day].evening"
                class="form-checkbox" />
              <label :for="`${day}-evening`" class="ml-2 text-sm  text-logo-blue">Evening</label>
            </div>
          </div>
        </div>
      </div>


      <div>
        <label class="text-logo-blue mb-2 block text-sm font-medium " for="reason">Tell us about
          yourself</label>
        <textarea id="reason" name="reason" v-model="player.bio" maxlength="500" required
          class="text-logo-blue block w-full min-w-0 flex-1 rounded-lg border   p-2.5 text-sm   border-gray-600 bg-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"></textarea>
        <div class="text-right text-sm text-gray-600 ">{{ player.bio.length }}/500</div>
      </div>
      <div class="flex items-center">
        <input type="checkbox" id="thursdayAvailability" required
          class="h-4 w-4 text-blue-600  rounded  focus:ring-blue-600 ring-offset-gray-800 bg-gray-700 border-gray-600">
        <label for="thursdayAvailability" class="ml-2 block text-sm  text-logo-blue">
          Committing to the LCC is a 4.5 Month, 19 Week Commitment. I acknowledge that I will be available Thursday
          nights from 7PM-11PM EST from March 5th to June 25th.
        </label>
      </div>
      <input type="submit" value="Register"
        class="bg-logo-blue text-logo-white hover:bg-logo-blue-5 mt-4 cursor-pointer rounded px-4 py-2 font-bold" />
    </form>
    </template>
  </div>
</template>


<script>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import ResponseBox from '../components/ResponseBox.vue';

export default {
  name: 'RegistrationView',
  components: {
    ResponseBox
  },
  setup() {
    const initialPlayerState = {
      name: '',
      tag: '',
      email: '',
      bio: '',
      canSub: false,
      primaryRole: '',
      secondaryRole: '',
      availability: {
        Monday: { morning: false, evening: false },
        Tuesday: { morning: false, evening: false },
        Wednesday: { morning: false, evening: false },
        Thursday: { morning: false, evening: false },
        Friday: { morning: false, evening: false },
        Saturday: { morning: false, evening: false },
        Sunday: { morning: false, evening: false }
      }
      
    }

    const isAuthenticated = ref(false)
    const player = ref({...initialPlayerState})
    const roles = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT", "FLEX"]
    const responseMessage = ref('')
    const isError = ref(false)
    const discord_id = ref('')
    const discord_username = ref('')
    const discord_avatar = ref('')
    const days = ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday", "Sunday"]

    const REGISTRATION_CLOSE_DATE = new Date('2026-02-05')
    const isRegistrationOpen = new Date() <= REGISTRATION_CLOSE_DATE

    const checkAuthentication = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + '/me')
        console.log(response.data)
        if(response.data.username)
          isAuthenticated.value = true
        discord_id.value = response.data.id
        discord_username.value = response.data.username
        discord_avatar.value = response.data.avatar_url
      } catch (error) {
        console.error('Error checking authentication:', error)
        isAuthenticated.value = false
      }
    }

    const submitForm = async () => {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL + '/players/add', {
          ...player.value, discord_id: discord_id.value, discord_username: discord_username.value, discord_avatar: discord_avatar.value
        })
        player.value = {...initialPlayerState}
        isError.value = false
        responseMessage.value = 'Player added successfully'
        player.value = {...initialPlayerState}
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (error) {
        console.error('Error adding player:', error)
        isError.value = true
        responseMessage.value = 'Error adding player'
      }
    }

    onMounted(() => {
      // checkAuthentication()
    })

    return {
      player,
      roles,
      responseMessage,
      isError,
      submitForm,
      isAuthenticated,
      days,
      isRegistrationOpen
    }
  }
}
</script>