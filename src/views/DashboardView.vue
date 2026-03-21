<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">

    <!-- Not logged in -->
    <div v-if="!authStore.loading && !authStore.isLoggedIn"
      class="flex flex-col items-center justify-center py-24 text-center">
      <h2 class="text-2xl font-bold text-white mb-2">Sign in to view your dashboard</h2>
      <p class="text-gray-400 text-sm mb-6">Connect your Discord account to access your personal stats.</p>
      <LoginButton />
    </div>

    <!-- Loading -->
    <div v-else-if="authStore.loading" class="flex justify-center py-24">
      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Dashboard -->
    <template v-else>

      <!-- Profile header -->
      <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6 flex items-center gap-5 flex-wrap">
        <div class="relative">
          <img v-if="authStore.avatarUrl" :src="authStore.avatarUrl" :alt="authStore.displayName"
            class="w-20 h-20 rounded-full ring-2 ring-gray-600 object-cover" />
          <div v-else class="w-20 h-20 rounded-full bg-indigo-700 flex items-center justify-center text-2xl font-bold text-white ring-2 ring-gray-600">
            {{ authStore.displayName.charAt(0).toUpperCase() }}
          </div>
          <span v-if="authStore.isAdmin"
            class="absolute -bottom-1 -right-1 text-xs font-bold px-1.5 py-0.5 rounded bg-yellow-600 text-yellow-100">
            Admin
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold text-white truncate">{{ authStore.displayName }}</h1>
          <p v-if="player.profile?.primaryRole || player.profile?.primary_role" class="text-sm text-gray-400">
            {{ player.profile.primaryRole || player.profile.primary_role }}
            <template v-if="player.profile?.secondaryRole || player.profile?.secondary_role">
              · {{ player.profile.secondaryRole || player.profile.secondary_role }}
            </template>
          </p>
          <p v-if="player.profile?.bio" class="text-sm text-gray-500 mt-1 line-clamp-2">{{ player.profile.bio }}</p>
          <div v-if="player.profile?.tag" class="mt-1">
            <span class="text-xs text-gray-500 font-mono">{{ authStore.displayName }}#{{ player.profile.tag }}</span>
          </div>
        </div>
        <RouterLink v-if="authStore.puuid" :to="`/players/${authStore.puuid}`"
          class="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex-shrink-0">
          Full Profile →
        </RouterLink>
      </div>

      <!-- Main grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Left col: champion stats + practice -->
        <div class="lg:col-span-1 space-y-4">

          <!-- Top champions -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Top Champions</h2>
            <div v-if="loadingStats" class="text-sm text-gray-500">Loading...</div>
            <div v-else-if="!authStore.puuid" class="text-sm text-gray-500">No Riot account linked.</div>
            <div v-else-if="!championStats.length" class="text-sm text-gray-500">No games played yet.</div>
            <ul v-else class="space-y-2">
              <li v-for="c in championStats.slice(0, 5)" :key="c.champion.name"
                class="flex items-center gap-3">
                <img :src="resolveImg(c.champion.image?.square || c.champion.image?.tile)"
                  :alt="c.champion.name" class="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white truncate">{{ c.champion.name }}</p>
                  <p class="text-xs text-gray-500">
                    {{ c.gamesPlayed }}G · {{ winRate(c) }}% WR · {{ kda(c) }} KDA
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Practice log -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Practice Log</h2>
              <RouterLink to="/practice" class="text-xs text-blue-400 hover:text-blue-300">+ Add</RouterLink>
            </div>
            <div v-if="loadingPractice" class="text-sm text-gray-500">Loading...</div>
            <div v-else-if="!practiceEntries.length" class="text-sm text-gray-500">No entries yet.</div>
            <ul v-else class="space-y-2">
              <li v-for="e in practiceEntries.slice(0, 5)" :key="e._id"
                class="text-xs text-gray-400 flex items-start gap-2">
                <span class="font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  :class="e.win ? 'bg-green-800 text-green-300' : 'bg-red-900 text-red-300'">
                  {{ e.win ? 'W' : 'L' }}
                </span>
                <div class="min-w-0">
                  <p class="truncate text-gray-300">{{ e.myChampion }} · {{ e.goal }}</p>
                  <p class="text-gray-600">{{ formatDate(e.submittedAt) }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Right col: recent matches -->
        <div class="lg:col-span-2">
          <div class="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-700">
              <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Matches</h2>
            </div>
            <div v-if="loadingMatches" class="p-8 flex justify-center">
              <div class="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="!authStore.puuid" class="p-6 text-sm text-gray-500">No Riot account linked.</div>
            <div v-else-if="!recentMatches.length" class="p-6 text-sm text-gray-500">No match history found.</div>
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm text-gray-300">
                <thead>
                  <tr class="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-700">
                    <th class="px-4 py-2 text-left">Champion</th>
                    <th class="px-4 py-2 text-center">Result</th>
                    <th class="px-4 py-2 text-center">KDA</th>
                    <th class="px-4 py-2 text-center hidden sm:table-cell">CS/m</th>
                    <th class="px-4 py-2 text-right hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in recentMatches" :key="m.matchId"
                    class="border-b border-gray-700/50 last:border-0"
                    :class="m.win ? 'bg-green-900/10' : 'bg-red-900/10'">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <img v-if="m.champion?.image?.square" :src="resolveImg(m.champion.image.square)"
                          :alt="m.champion.name" class="w-7 h-7 rounded object-cover" />
                        <span class="font-medium truncate max-w-[80px]">{{ m.champion?.name }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-bold text-xs px-2 py-0.5 rounded"
                        :class="m.win ? 'bg-green-700 text-green-200' : 'bg-red-800 text-red-200'">
                        {{ m.win ? 'W' : 'L' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-center font-mono text-xs">
                      {{ m.kills }}/{{ m.deaths }}/{{ m.assists }}
                    </td>
                    <td class="px-4 py-3 text-center text-xs hidden sm:table-cell">
                      {{ m.csm?.toFixed(1) ?? '—' }}
                    </td>
                    <td class="px-4 py-3 text-right text-xs text-gray-500 hidden md:table-cell">
                      {{ formatDate(m.gameStartTimestamp) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin panel -->
      <div v-if="authStore.isAdmin" class="mt-6 bg-gray-800 border border-yellow-700/50 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h2 class="text-lg font-bold text-yellow-300">Admin Panel</h2>
        </div>

        <!-- Your Discord ID -->
        <p class="text-xs text-gray-400 mb-1">Your Discord ID</p>
        <p class="font-mono text-sm text-gray-300 mb-4">{{ player.discord?.id || '—' }}</p>

        <!-- Quick links -->
        <div class="flex flex-wrap gap-2 mb-5">
          <RouterLink to="/tournament"
            class="px-3 py-1.5 text-sm bg-yellow-700/30 border border-yellow-700 text-yellow-300 rounded-lg hover:bg-yellow-700/50 transition-colors">
            Tournament Manager
          </RouterLink>
        </div>

        <!-- Manage admins -->
        <div class="border-t border-gray-700 pt-4">
          <h3 class="text-sm font-semibold text-gray-300 mb-3">Manage Admin Access</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select v-model="adminForm.discordId"
              class="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500">
              <option value="" disabled>Select a player…</option>
              <option
                v-for="p in adminPlayers"
                :key="p.profile?.name"
                :value="p.discord?.id || ''"
                :disabled="!p.discord?.id"
              >
                {{ (p.profile?.name || '?') + (p.is_admin ? ' ★' : '') + (!p.discord?.id ? ' (not linked)' : '') }}
              </option>
            </select>
            <div class="flex gap-2">
              <button @click="setAdmin(true)" :disabled="!adminForm.discordId"
                class="flex-1 bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                Grant
              </button>
              <button @click="setAdmin(false)" :disabled="!adminForm.discordId"
                class="flex-1 bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                Revoke
              </button>
            </div>
          </div>
          <p v-if="adminMessage" class="text-xs mt-2" :class="adminSuccess ? 'text-green-400' : 'text-red-400'">
            {{ adminMessage }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { DDRAGON_URL } from '@/config.js'
import LoginButton from '@/components/LoginButton.vue'
import ResponseBox from '@/components/ResponseBox.vue'

const API = () => import.meta.env.VITE_API_URL

function resolveImg(url) {
  if (!url) return ''
  return url.startsWith('http') ? url : DDRAGON_URL + url
}

export default {
  name: 'DashboardView',
  components: { LoginButton, ResponseBox },
  setup() {
    const authStore = useAuthStore()

    const player         = computed(() => authStore.player || {})
    const championStats  = ref([])
    const recentMatches  = ref([])
    const practiceEntries= ref([])
    const loadingStats   = ref(false)
    const loadingMatches = ref(false)
    const loadingPractice= ref(false)

    const adminForm    = ref({ discordId: '' })
    const adminMessage = ref('')
    const adminSuccess = ref(false)
    const adminPlayers = ref([])

    const winRate = (c) => c.gamesPlayed ? Math.round((c.wins / c.gamesPlayed) * 100) : 0
    const kda     = (c) => c.deaths ? ((c.kills + c.assists) / c.deaths).toFixed(2) : 'Perfect'

    const formatDate = (val) => {
      if (!val) return '—'
      const d = typeof val === 'number' ? new Date(val) : new Date(val)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const loadPlayerData = async () => {
      const puuid = authStore.puuid
      const name  = authStore.displayName
      if (!puuid && !name) return

      if (authStore.isAdmin) {
        try {
          const { data } = await axios.get(API() + '/admin/players', { withCredentials: true })
          adminPlayers.value = data.sort((a, b) =>
            (a.profile?.name || '').localeCompare(b.profile?.name || '')
          )
        } catch { /* silent */ }
      }

      if (puuid) {
        loadingStats.value   = true
        loadingMatches.value = true
        try {
          const [statsRes, matchRes] = await Promise.all([
            axios.get(API() + `/players/${puuid}/champion-stats`, { withCredentials: false }),
            axios.get(API() + `/players/${puuid}/matches?per_page=8`, { withCredentials: false }),
          ])
          championStats.value = statsRes.data
          recentMatches.value = matchRes.data.matches || []
        } catch { /* silent */ }
        finally {
          loadingStats.value   = false
          loadingMatches.value = false
        }
      }

      if (name) {
        loadingPractice.value = true
        try {
          const { data } = await axios.get(
            API() + `/practice/?player=${encodeURIComponent(name)}&limit=10`,
            { withCredentials: false }
          )
          practiceEntries.value = data
        } catch { /* silent */ }
        finally { loadingPractice.value = false }
      }
    }

    const setAdmin = async (grant) => {
      adminMessage.value = ''
      try {
        const { data } = await axios.post(
          API() + (grant ? '/admin/set-admin' : '/admin/revoke-admin'),
          { discordId: adminForm.value.discordId },
          { withCredentials: true }
        )
        adminMessage.value = data.message
        adminSuccess.value = true
        adminForm.value.discordId = ''
      } catch (e) {
        adminMessage.value = e.response?.data?.message ?? 'Error.'
        adminSuccess.value = false
      }
    }

    // Load data once auth is resolved
    watch(() => authStore.loading, (loading) => {
      if (!loading && authStore.isLoggedIn) loadPlayerData()
    })

    onMounted(() => {
      if (!authStore.loading && authStore.isLoggedIn) loadPlayerData()
    })

    return {
      authStore, player, championStats, recentMatches, practiceEntries,
      loadingStats, loadingMatches, loadingPractice,
      adminForm, adminMessage, adminSuccess, adminPlayers,
      winRate, kda, formatDate, setAdmin, resolveImg,
    }
  }
}
</script>
