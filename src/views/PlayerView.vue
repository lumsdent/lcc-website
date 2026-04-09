<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <RouterLink to="/players" class="hover:text-white transition-colors">Players</RouterLink>
        <span>/</span>
        <span class="text-gray-300">{{ player?.profile?.name ?? '…' }}</span>
      </nav>

      <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">

        <!-- Left Panel: Player Card + Refresh -->
        <div class="xl:col-span-1 flex flex-col items-center gap-3">
          <PlayerCard :player="player" />
          <button
            @click="refreshPlayer"
            :disabled="isRefreshing || !canRefresh"
            class="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transition-transform"
              :class="{ 'animate-spin': isRefreshing }"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isRefreshing ? 'Refreshing…' : 'Refresh Riot Data' }}
          </button>
          <p v-if="!canRefresh && nextRefreshTime" class="text-xs text-gray-500 text-center">Available after {{ nextRefreshTime }}</p>
          <p v-if="refreshMessage" class="text-xs text-center" :class="refreshError ? 'text-red-400' : 'text-green-400'">{{ refreshMessage }}</p>
        </div>

        <!-- Right Panel: Match History -->
        <div class="xl:col-span-3">
          <div id="match-history-section" class="flex items-center gap-3 mb-4">
            <h2 class="text-xl font-bold text-white">Match History</h2>
            <div v-if="championFilter" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-900 text-blue-300 text-sm font-medium">
              <img class="w-4 h-4 rounded" :src="getItemImageUrl(sortedChampionStats.find(c => c.champion.name === championFilter)?.champion?.image?.square ?? '')" :alt="championFilter" />
              {{ championFilter }}
              <button @click="clearChampionFilter" class="ml-1 text-blue-400 hover:text-white leading-none">&times;</button>
            </div>
          </div>

          <div v-if="matchesLoading && matchDetails.length === 0" class="rounded-lg bg-gray-800 p-8 flex justify-center">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else-if="matchDetails.length > 0" class="rounded-lg overflow-hidden bg-gray-800">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-gray-300">
                <thead>
                  <tr class="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-700">
                    <th class="py-3 px-4 text-left">Team</th>
                    <th class="py-3 px-4 text-left">Opponent</th>
                    <th class="py-3 px-4 text-center">Date</th>
                    <th class="py-3 px-4 text-center">Result</th>
                    <th class="py-3 px-4 text-center">Matchup</th>
                    <th class="py-3 px-4 text-center">KDA</th>
                    <th class="py-3 px-4 text-center">Build</th>
                    <th class="py-3 px-4 text-center">Spells</th>
                    <th class="py-3 px-4 text-center">VOD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="match in matchDetails"
                    :key="match.matchId"
                    class="border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
                    :class="match.win ? 'border-l-2 border-l-green-500' : 'border-l-2 border-l-red-500'"
                    @click="goToMatchDetail(match.matchId)"
                  >
                    <td class="py-3 px-4 font-medium text-white">{{ match.teamName }}</td>
                    <td class="py-3 px-4 text-gray-400">{{ match.opponentTeamName }}</td>
                    <td class="py-3 px-4 text-center text-gray-400">{{ new Date(match.gameStartTimestamp).toLocaleDateString() }}</td>
                    <td class="py-3 px-4 text-center">
                      <span
                        class="px-2 py-0.5 rounded text-xs font-bold"
                        :class="match.win ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
                      >
                        {{ match.win ? 'WIN' : 'LOSS' }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-center gap-1">
                        <img class="w-8 h-8 rounded" :src="`${DDRAGON_URL}${match.champion.image.square}`" :title="match.champion.name" :alt="match.champion.name" />
                        <span class="text-gray-600 text-xs">vs</span>
                        <img v-if="match.opponentChampion" class="w-8 h-8 rounded" :src="`${DDRAGON_URL}${match.opponentChampion.image.square}`" :title="match.opponentChampion.name" :alt="match.opponentChampion.name" />
                      </div>
                    </td>
                    <td class="py-3 px-4 text-center font-mono">
                      <span class="text-green-400">{{ match.kills }}</span>
                      <span class="text-gray-500">/</span>
                      <span class="text-red-400">{{ match.deaths }}</span>
                      <span class="text-gray-500">/</span>
                      <span class="text-blue-400">{{ match.assists }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-center gap-0.5 flex-wrap">
                        <img
                          v-for="item in match.build"
                          :key="item.name"
                          class="w-7 h-7 rounded"
                          :src="getItemImageUrl(item.image)"
                          :title="item.name"
                          :alt="item.name"
                        />
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-center gap-0.5">
                        <img
                          v-for="spell in match.summonerSpells"
                          :key="spell.name"
                          class="w-7 h-7 rounded"
                          :src="`${DDRAGON_URL}${spell.image}`"
                          :title="spell.name"
                          :alt="spell.name"
                        />
                        <img
                          class="w-7 h-7 rounded"
                          :src="match.runes.primary.keystone.image"
                          :title="match.runes.primary.keystone.name"
                          :alt="match.runes.primary.keystone.name"
                        />
                      </div>
                    </td>
                    <td class="py-3 px-4 text-center" @click.stop>
                      <a
                        v-if="match.vod"
                        :href="match.vod"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >VOD</a>
                      <span v-else class="text-gray-600 text-xs">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="totalPages > 1" class="mt-3 flex items-center justify-between px-1">
            <p class="text-sm text-gray-500">
              Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, totalMatches) }} of {{ totalMatches }} matches
            </p>
            <div class="flex items-center gap-2">
              <button
                @click="loadMatches(currentPage - 1)"
                :disabled="currentPage <= 1 || matchesLoading"
                class="px-3 py-1.5 text-sm font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
              >← Prev</button>
              <span class="text-sm text-gray-400">{{ currentPage }} / {{ totalPages }}</span>
              <button
                @click="loadMatches(currentPage + 1)"
                :disabled="currentPage >= totalPages || matchesLoading"
                class="px-3 py-1.5 text-sm font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
              >Next →</button>
            </div>
          </div>

          <div v-else-if="!matchesLoading && totalMatches === 0" class="rounded-lg bg-gray-800 p-8 text-center text-gray-500">
            No match history available.
          </div>
        </div>

      </div>

      <!-- Champion Stats Section -->
      <div v-if="sortedChampionStats.length" class="mt-10">
        <h2 class="text-xl font-bold text-white mb-4">Champion Stats</h2>
        <div class="rounded-lg overflow-hidden bg-gray-800">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-300">
              <thead>
                <tr class="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-700 bg-gray-900">
                  <th class="py-3 px-4 text-left cursor-pointer hover:text-white select-none" @click="setChampSort('champion')">
                    Champion <span class="ml-1 text-gray-400">{{ champSortBy === 'champion' ? (champSortDir === 'asc' ? '↑' : '↓') : '' }}</span>
                  </th>
                  <th class="py-3 px-4 text-center cursor-pointer hover:text-white select-none" @click="setChampSort('gamesPlayed')">
                    Games <span class="ml-1 text-gray-400">{{ champSortBy === 'gamesPlayed' ? (champSortDir === 'asc' ? '↑' : '↓') : '' }}</span>
                  </th>
                  <th class="py-3 px-4 text-center cursor-pointer hover:text-white select-none" @click="setChampSort('winRate')">
                    Win% <span class="ml-1 text-gray-400">{{ champSortBy === 'winRate' ? (champSortDir === 'asc' ? '↑' : '↓') : '' }}</span>
                  </th>
                  <th class="py-3 px-4 text-center cursor-pointer hover:text-white select-none" @click="setChampSort('kda')">
                    KDA <span class="ml-1 text-gray-400">{{ champSortBy === 'kda' ? (champSortDir === 'asc' ? '↑' : '↓') : '' }}</span>
                  </th>
                  <th class="py-3 px-4 text-center">K/D/A</th>
                  <th class="py-3 px-4 text-center cursor-pointer hover:text-white select-none" @click="setChampSort('killParticipation')">
                    Kill Part% <span class="ml-1 text-gray-400">{{ champSortBy === 'killParticipation' ? (champSortDir === 'asc' ? '↑' : '↓') : '' }}</span>
                  </th>
                  <th class="py-3 px-4 text-center cursor-pointer hover:text-white select-none" @click="setChampSort('damagePerMinute')">
                    Dmg/min <span class="ml-1 text-gray-400">{{ champSortBy === 'damagePerMinute' ? (champSortDir === 'asc' ? '↑' : '↓') : '' }}</span>
                  </th>
                  <th class="py-3 px-4 text-center cursor-pointer hover:text-white select-none" @click="setChampSort('cs14')">
                    CS@14 <span class="ml-1 text-gray-400">{{ champSortBy === 'cs14' ? (champSortDir === 'asc' ? '↑' : '↓') : '' }}</span>
                  </th>
                  <th class="py-3 px-4 text-center cursor-pointer hover:text-white select-none" @click="setChampSort('csm')">
                    CS/min <span class="ml-1 text-gray-400">{{ champSortBy === 'csm' ? (champSortDir === 'asc' ? '↑' : '↓') : '' }}</span>
                  </th>
                  <th class="py-3 px-4 text-center cursor-pointer hover:text-white select-none" @click="setChampSort('goldPerMinute')">
                    Gold/min <span class="ml-1 text-gray-400">{{ champSortBy === 'goldPerMinute' ? (champSortDir === 'asc' ? '↑' : '↓') : '' }}</span>
                  </th>
                  <th class="py-3 px-4 text-center cursor-pointer hover:text-white select-none" @click="setChampSort('visionScorePerMinute')">
                    Vision/min <span class="ml-1 text-gray-400">{{ champSortBy === 'visionScorePerMinute' ? (champSortDir === 'asc' ? '↑' : '↓') : '' }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Overall row -->
                <tr v-if="overallStats"
                  class="border-b-2 border-gray-600 bg-gray-900/60"
                  :class="championFilter === null ? 'cursor-pointer hover:bg-gray-700' : 'cursor-pointer hover:bg-gray-700'"
                  @click="clearChampionFilter()"
                >
                  <td class="py-3 px-4">
                    <span class="font-bold text-gray-200 tracking-wide text-xs uppercase">All Champions</span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <div class="text-white font-bold">{{ overallStats.gamesPlayed }}</div>
                    <div class="text-xs text-gray-500">{{ overallStats.wins }}W {{ overallStats.losses }}L</div>
                  </td>
                  <td class="py-3 px-4 text-center min-w-[110px]">
                    <div class="w-full bg-gray-700 rounded-full h-2 mb-1">
                      <div class="h-2 rounded-full"
                        :class="(overallStats.wins / overallStats.gamesPlayed) >= 0.5 ? 'bg-blue-500' : 'bg-red-500'"
                        :style="`width: ${(overallStats.wins / overallStats.gamesPlayed * 100).toFixed(0)}%`"
                      ></div>
                    </div>
                    <span class="text-xs">{{ (overallStats.wins / overallStats.gamesPlayed * 100).toFixed(0) }}%</span>
                  </td>
                  <td class="py-3 px-4 text-center font-bold"
                    :class="overallStats.kda >= 3.5 ? 'text-green-400' : overallStats.kda >= 2.5 ? 'text-yellow-400' : 'text-red-400'">
                    {{ overallStats.kda.toFixed(2) }}
                  </td>
                  <td class="py-3 px-4 text-center font-mono text-xs">
                    <span class="text-green-400">{{ (overallStats.kills / overallStats.gamesPlayed).toFixed(1) }}</span>
                    <span class="text-gray-500">/</span>
                    <span class="text-red-400">{{ (overallStats.deaths / overallStats.gamesPlayed).toFixed(1) }}</span>
                    <span class="text-gray-500">/</span>
                    <span class="text-blue-400">{{ (overallStats.assists / overallStats.gamesPlayed).toFixed(1) }}</span>
                  </td>
                  <td class="py-3 px-4 text-center">{{ overallStats.killParticipation.toFixed(0) }}%</td>
                  <td class="py-3 px-4 text-center">{{ overallStats.dpm.toFixed(0) }}</td>
                  <td class="py-3 px-4 text-center">{{ overallStats.cs14.toFixed(0) }}</td>
                  <td class="py-3 px-4 text-center">{{ overallStats.csm.toFixed(1) }}</td>
                  <td class="py-3 px-4 text-center">{{ overallStats.gpm.toFixed(0) }}</td>
                  <td class="py-3 px-4 text-center">{{ overallStats.vspm.toFixed(2) }}</td>
                </tr>
                <tr
                  v-for="champ in sortedChampionStats"
                  :key="champ.champion.name"
                  class="border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
                  :class="championFilter === champ.champion.name ? 'bg-blue-900/20 border-l-2 border-l-blue-500' : ''"
                  @click="filterByChampion(champ.champion.name)"
                >
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <img class="w-8 h-8 rounded" :src="getItemImageUrl(champ.champion.image.square)" :alt="champ.champion.name" />
                      <span class="font-medium text-white">{{ champ.champion.name }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <div class="text-white font-medium">{{ champ.gamesPlayed }}</div>
                    <div class="text-xs text-gray-500">{{ champ.wins }}W {{ champ.losses }}L</div>
                  </td>
                  <td class="py-3 px-4 text-center min-w-[110px]">
                    <div class="w-full bg-gray-700 rounded-full h-2 mb-1">
                      <div
                        class="h-2 rounded-full"
                        :class="(champ.wins / Math.max(1, champ.gamesPlayed)) >= 0.5 ? 'bg-blue-500' : 'bg-red-500'"
                        :style="`width: ${(champ.wins / champ.gamesPlayed * 100).toFixed(0)}%`"
                      ></div>
                    </div>
                    <span class="text-xs">{{ (champ.wins / champ.gamesPlayed * 100).toFixed(0) }}%</span>
                  </td>
                  <td class="py-3 px-4 text-center font-semibold"
                    :class="champ.kda >= 3.5 ? 'text-green-400' : champ.kda >= 2.5 ? 'text-yellow-400' : 'text-red-400'">
                    {{ champ.kda.toFixed(2) }}
                  </td>
                  <td class="py-3 px-4 text-center font-mono text-xs">
                    <span class="text-green-400">{{ (champ.kills / champ.gamesPlayed).toFixed(1) }}</span>
                    <span class="text-gray-500">/</span>
                    <span class="text-red-400">{{ (champ.deaths / champ.gamesPlayed).toFixed(1) }}</span>
                    <span class="text-gray-500">/</span>
                    <span class="text-blue-400">{{ (champ.assists / champ.gamesPlayed).toFixed(1) }}</span>
                  </td>
                  <td class="py-3 px-4 text-center">{{ champ.killParticipation.toFixed(0) }}%</td>
                  <td class="py-3 px-4 text-center">{{ champ.dpm.toFixed(0) }}</td>
                  <td class="py-3 px-4 text-center">{{ champ.cs14.toFixed(0) }}</td>
                  <td class="py-3 px-4 text-center">{{ champ.csm.toFixed(1) }}</td>
                  <td class="py-3 px-4 text-center">{{ champ.gpm.toFixed(0) }}</td>
                  <td class="py-3 px-4 text-center">{{ champ.vspm.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PlayerCard from '@/components/PlayerCard.vue';
import { DDRAGON_URL } from '@/config.js';
export default {
    name: 'PlayerView',
    props: {
        puuid: {
            type: String,
            required: true
        }
    },
    components: {
        PlayerCard
    },
    setup(props) {
        const player = ref(null)
        const matchDetails = ref([])
        const matchesLoading = ref(false)
        const currentPage = ref(1)
        const totalMatches = ref(0)
        const totalPages = ref(1)
        const perPage = 10
        const championFilter = ref(null)
        const championStatsData = ref([])
        const champSortBy = ref('gamesPlayed')
        const champSortDir = ref('desc')
        const router = useRouter()
        const selectedSeason = ref('allTime')
        const isRefreshing = ref(false)
        const refreshMessage = ref('')
        const refreshError = ref(false)

        const canRefresh = computed(() => {
            const lastRefreshed = player.value?.profile?.last_refreshed
            if (!lastRefreshed) return true
            const hoursSince = (Date.now() - lastRefreshed) / (1000 * 60 * 60)
            return hoursSince >= 24
        })

        const overallStats = computed(() => {
            const stats = championStatsData.value
            if (!stats.length) return null
            const total = stats.reduce((acc, c) => {
                acc.gamesPlayed += c.gamesPlayed
                acc.wins += c.wins
                acc.losses += c.losses
                acc.kills += c.kills
                acc.deaths += c.deaths
                acc.assists += c.assists
                acc.killParticipation += c.killParticipation * c.gamesPlayed
                acc.dpm += c.dpm * c.gamesPlayed
                acc.cs14 += c.cs14 * c.gamesPlayed
                acc.csm += c.csm * c.gamesPlayed
                acc.gpm += c.gpm * c.gamesPlayed
                acc.vspm += c.vspm * c.gamesPlayed
                return acc
            }, { gamesPlayed: 0, wins: 0, losses: 0, kills: 0, deaths: 0, assists: 0, killParticipation: 0, dpm: 0, cs14: 0, csm: 0, gpm: 0, vspm: 0 })
            const g = total.gamesPlayed
            return {
                ...total,
                kda: (total.kills + total.assists) / Math.max(1, total.deaths),
                killParticipation: total.killParticipation / g,
                dpm: total.dpm / g,
                cs14: total.cs14 / g,
                csm: total.csm / g,
                gpm: total.gpm / g,
                vspm: total.vspm / g,
            }
        })

        const sortedChampionStats = computed(() => {
            const stats = championStatsData.value
            return [...stats].sort((a, b) => {
                let valA, valB
                if (champSortBy.value === 'champion') {
                    return champSortDir.value === 'asc'
                        ? a.champion.name.localeCompare(b.champion.name)
                        : b.champion.name.localeCompare(a.champion.name)
                } else if (champSortBy.value === 'winRate') {
                    valA = a.wins / Math.max(1, a.gamesPlayed)
                    valB = b.wins / Math.max(1, b.gamesPlayed)
                } else {
                    valA = Number(a[champSortBy.value])
                    valB = Number(b[champSortBy.value])
                }
                return champSortDir.value === 'asc' ? valA - valB : valB - valA
            })
        })

        const setChampSort = (key) => {
            if (champSortBy.value === key) {
                champSortDir.value = champSortDir.value === 'asc' ? 'desc' : 'asc'
            } else {
                champSortBy.value = key
                champSortDir.value = 'desc'
            }
        }

        const filterByChampion = (championName) => {
            championFilter.value = championName
            loadMatches(1, championName)
            document.getElementById('match-history-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }

        const clearChampionFilter = () => {
            championFilter.value = null
            loadMatches(1, null)
        }

        const nextRefreshTime = computed(() => {
            const lastRefreshed = player.value?.profile?.last_refreshed
            if (!lastRefreshed) return null
            const next = new Date(lastRefreshed + 24 * 60 * 60 * 1000)
            return next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })

        const goToMatchDetail = (matchId) => {
            router.push({
                path: `/match/${matchId}`,
                query: {
                    from: 'player',
                    puuid: props.puuid,
                    playerName: player.value?.profile?.name
                }
            })
        }

        const getItemImageUrl = (image) => {
            return image.startsWith('http') ? image : `${DDRAGON_URL}${image}`
        }

        const loadMatches = async (page = 1, champion = championFilter.value) => {
            matchesLoading.value = true
            try {
                const params = { page, per_page: perPage }
                if (champion) params.champion = champion
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/players/${props.puuid}/matches`, { params })
                matchDetails.value = res.data.matches
                currentPage.value = res.data.page
                totalMatches.value = res.data.total
                totalPages.value = res.data.pages
            } catch (error) {
                console.error('Error fetching matches:', error)
            } finally {
                matchesLoading.value = false
            }
        }

        onMounted(async () => {
            try {
                const [playerRes, champRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/players/${props.puuid}`),
                    axios.get(`${import.meta.env.VITE_API_URL}/players/${props.puuid}/champion-stats`)
                ])
                player.value = playerRes.data
                championStatsData.value = champRes.data
            } catch (error) {
                console.error('Error fetching player data:', error)
            }
            await loadMatches(1)
        })

        const refreshPlayer = async () => {
            if (!canRefresh.value) return
            isRefreshing.value = true
            refreshMessage.value = ''
            refreshError.value = false
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/players/${props.puuid}/refresh`)
                player.value = response.data.player
                refreshMessage.value = 'Profile updated!'
            } catch (error) {
                if (error.response?.status === 429) {
                    refreshMessage.value = 'Profile was updated within the last 24 hours.'
                } else {
                    console.error('Error refreshing player:', error)
                    refreshError.value = true
                    refreshMessage.value = error.response?.data?.message ?? 'Refresh failed.'
                }
            } finally {
                isRefreshing.value = false
            }
        }

        return {
            player,
            matchDetails,
            matchesLoading,
            currentPage,
            totalMatches,
            totalPages,
            perPage,
            loadMatches,
            championFilter,
            filterByChampion,
            clearChampionFilter,
            overallStats,
            sortedChampionStats,
            champSortBy,
            champSortDir,
            setChampSort,
            goToMatchDetail,
            selectedSeason,
            DDRAGON_URL,
            getItemImageUrl,
            refreshPlayer,
            isRefreshing,
            canRefresh,
            nextRefreshTime,
            refreshMessage,
            refreshError
        }
    }
}
</script>