<template>
  <div class="container mx-auto px-4 py-12 max-w-3xl">

    <!-- Loading pending discord info -->
    <div v-if="state === 'loading'" class="flex justify-center py-24">
      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- No pending claim — not coming from OAuth -->
    <div v-else-if="state === 'no-pending'" class="flex flex-col items-center py-24 text-center">
      <h2 class="text-2xl font-bold text-white mb-2">Nothing to claim</h2>
      <p class="text-gray-400 text-sm mb-6">
        This page is only accessible right after signing in with Discord.
        If you're already linked, head to your dashboard.
      </p>
      <RouterLink to="/dashboard"
        class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
        Go to Dashboard
      </RouterLink>
    </div>

    <!-- Select profile -->
    <template v-else-if="state === 'select'">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-2">Link Your Profile</h1>
        <p class="text-gray-400 text-sm">
          Welcome, <span class="text-white font-semibold">{{ pending.username }}</span>!
          Select your existing player profile below to link it to your Discord account.
        </p>
      </div>

      <!-- Search -->
      <div class="mb-5">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name…"
          class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <!-- Player list -->
      <div v-if="filteredPlayers.length" class="space-y-3">
        <button
          v-for="player in filteredPlayers"
          :key="player.profile.puuid"
          @click="selectPlayer(player)"
          class="w-full flex items-center gap-4 bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-xl p-4 transition-colors text-left"
        >
          <img
            v-if="player.profile.images?.icon"
            :src="DDRAGON_URL + player.profile.images.icon"
            :alt="player.profile.name"
            class="w-12 h-12 rounded-full ring-2 ring-gray-600 flex-shrink-0"
          />
          <div v-else class="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
            {{ player.profile.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <p class="text-white font-semibold truncate">{{ player.profile.name }}
              <span v-if="player.profile.tag" class="text-gray-500 font-normal text-sm">#{{ player.profile.tag }}</span>
            </p>
            <p v-if="currentTeam(player)" class="text-blue-400 text-xs mt-0.5 truncate">{{ currentTeam(player) }}</p>
          </div>
          <div class="ml-auto text-blue-400 text-sm font-medium flex-shrink-0">Select →</div>
        </button>
      </div>

      <div v-else class="text-center py-10 text-gray-500">
        No unclaimed profiles match your search.
      </div>

      <p class="mt-8 text-center text-xs text-gray-600">
        Don't see your profile? Contact a league admin to get it added.
      </p>
    </template>

    <!-- Confirmation step -->
    <template v-else-if="state === 'confirm'">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-2">Confirm Link</h1>
        <p class="text-gray-400 text-sm">Make sure this is you before confirming.</p>
      </div>

      <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-center gap-5 mb-6">
        <img
          v-if="selected.profile.images?.icon"
          :src="DDRAGON_URL + selected.profile.images.icon"
          :alt="selected.profile.name"
          class="w-16 h-16 rounded-full ring-2 ring-gray-600 flex-shrink-0"
        />
        <div v-else class="w-16 h-16 rounded-full bg-indigo-700 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {{ selected.profile.name?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <p class="text-white text-lg font-bold">{{ selected.profile.name }}
            <span v-if="selected.profile.tag" class="text-gray-500 font-normal text-sm">#{{ selected.profile.tag }}</span>
          </p>
          <p class="text-gray-400 text-sm">
            {{ selected.profile.primary_role || selected.profile.primaryRole || '' }}
          </p>
          <p v-if="currentTeam(selected)" class="text-blue-400 text-xs mt-0.5">{{ currentTeam(selected) }}</p>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6 flex items-center gap-3">
        <img
          v-if="pending.avatar_url"
          :src="pending.avatar_url"
          :alt="pending.username"
          class="w-10 h-10 rounded-full ring-2 ring-gray-600"
        />
        <div v-else class="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold text-white">
          {{ pending.username?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <p class="text-xs text-gray-500 uppercase tracking-wide">Discord account</p>
          <p class="text-white text-sm font-semibold">{{ pending.username }}</p>
        </div>
      </div>

      <p class="text-xs text-gray-500 text-center mb-6">
        This will permanently link your Discord account to this profile. This cannot be undone without admin help.
      </p>

      <div class="flex gap-3 justify-center">
        <button
          @click="state = 'select'"
          class="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          ← Back
        </button>
        <button
          @click="confirmClaim"
          :disabled="claiming"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <span v-if="claiming" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Confirm &amp; Link Account
        </button>
      </div>

      <p v-if="errorMsg" class="mt-4 text-center text-red-400 text-sm">{{ errorMsg }}</p>
    </template>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { DDRAGON_URL } from '@/config.js'
import axios from 'axios'

function currentTeam(player) {
  const teams = player.teams
  if (!teams?.length) return null
  // Each entry is { "<season>": { name, role } } — find the highest numeric season
  let best = null
  let bestSeason = -1
  for (const entry of teams) {
    const key = Object.keys(entry)[0]
    const num = parseFloat(key)
    if (!isNaN(num) && num > bestSeason) {
      bestSeason = num
      best = entry[key]
    }
  }
  return best?.name || null
}

export default {
  name: 'ClaimProfileView',
  setup() {
    const router    = useRouter()
    const authStore = useAuthStore()

    const state    = ref('loading')   // loading | no-pending | select | confirm
    const pending  = ref(null)        // discord info from /claim-pending/
    const players  = ref([])
    const search   = ref('')
    const selected = ref(null)
    const claiming = ref(false)
    const errorMsg = ref('')

    const filteredPlayers = computed(() => {
      const q = search.value.trim().toLowerCase()
      if (!q) return players.value
      return players.value.filter(p =>
        p.profile.name?.toLowerCase().includes(q)
      )
    })

    onMounted(async () => {
      const API = import.meta.env.VITE_API_URL
      try {
        const [pendingRes, unclaimedRes] = await Promise.all([
          axios.get(API + '/claim-pending/', { withCredentials: true }),
          axios.get(API + '/players/unclaimed', { withCredentials: true }),
        ])
        pending.value = pendingRes.data
        players.value = unclaimedRes.data
        state.value   = 'select'
      } catch (err) {
        if (err.response?.status === 404) {
          state.value = 'no-pending'
        } else {
          state.value = 'no-pending'
        }
      }
    })

    function selectPlayer(player) {
      selected.value = player
      errorMsg.value = ''
      state.value    = 'confirm'
    }

    async function confirmClaim() {
      claiming.value = true
      errorMsg.value = ''
      const API = import.meta.env.VITE_API_URL
      try {
        await axios.post(
          API + `/claim-profile/${selected.value.profile.puuid}/`,
          {},
          { withCredentials: true }
        )
        await authStore.fetchMe()
        router.push('/dashboard')
      } catch (err) {
        errorMsg.value = err.response?.data?.message || 'Something went wrong. Please try again.'
      } finally {
        claiming.value = false
      }
    }

    return { state, pending, players, search, selected, claiming, errorMsg, filteredPlayers, selectPlayer, confirmClaim, DDRAGON_URL, currentTeam }
  }
}
</script>
