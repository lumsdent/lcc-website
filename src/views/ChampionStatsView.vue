<template>
  <div class="container mx-auto px-4 py-8">

    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
      <RouterLink to="/stats" class="hover:text-gray-300 transition-colors">Stats</RouterLink>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      <span class="text-gray-300">Champions</span>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-1">Champion Statistics</h1>
      <p class="text-gray-400 text-sm">{{ selectedSeason === null ? 'All Time' : `Season ${selectedSeason}` }} &middot; {{ sortedChampions.length }} champions</p>
    </div>

    <!-- Season selector + Column button -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
      <!-- Season pills -->
      <button
        @click="selectSeason(null)"
        :class="selectedSeason === null ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
        class="px-3 py-1.5 rounded-full border text-sm font-medium transition-colors"
      >All Time</button>
      <button
        v-for="season in seasons"
        :key="season"
        @click="selectSeason(season)"
        :class="selectedSeason === season ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
        class="px-3 py-1.5 rounded-full border text-sm font-medium transition-colors"
      >Season {{ season }}</button>

      <div class="ml-auto relative">
        <button
          @click="showColumnSelector = !showColumnSelector"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M3 8h18M3 12h12" />
          </svg>
          Columns
        </button>
        <div
          v-if="showColumnSelector"
          class="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20 p-2"
        >
          <div class="flex justify-between items-center border-b border-gray-700 pb-2 mb-2 px-1">
            <span class="text-sm font-semibold text-white">Columns</span>
            <button @click="showColumnSelector = false" class="text-gray-500 hover:text-white text-xl leading-none">&times;</button>
          </div>
          <div class="max-h-72 overflow-y-auto space-y-0.5">
            <label
              v-for="col in selectableColumns"
              :key="col.key"
              class="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-800 cursor-pointer text-sm"
            >
              <input type="checkbox" :checked="selectedColumns.includes(col.key)" @change="toggleColumn(col.key)" class="accent-blue-500" />
              <span :class="selectedColumns.includes(col.key) ? 'text-white' : 'text-gray-400'">{{ col.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-gray-400 text-sm">Loading champion statistics...</p>
    </div>

    <!-- Table -->
    <div v-else class="rounded-lg overflow-hidden bg-gray-800">
      <div class="overflow-x-auto overflow-y-auto max-h-[75vh]">
        <table class="w-full text-sm text-gray-300">
          <thead>
            <tr class="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-700 bg-gray-900">
              <th
                v-for="column in visibleColumns"
                :key="column.key"
                class="py-3 px-4 whitespace-nowrap sticky top-0 bg-gray-900 z-10 select-none"
                :class="[
                  column.align === 'center' ? 'text-center' : 'text-left',
                  column.key === 'champion' ? 'sticky left-0 z-20' : 'cursor-pointer hover:text-white',
                ]"
                @click="column.key !== 'champion' ? setSort(column.key) : null"
              >
                {{ column.label }}
                <span v-if="sortBy === column.key" class="ml-1 text-blue-400">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="champ in sortedChampions" :key="champ.champion">
            <tr
              class="group border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
              :class="expandedChampion === champ.champion ? 'bg-gray-700/50' : ''"
              @click="toggleChampion(champ.champion)"
            >
              <td
                v-for="column in visibleColumns"
                :key="column.key"
                :class="[
                  column.align === 'center' ? 'text-center' : '',
                  column.key === 'champion' ? 'sticky left-0 z-10 bg-gray-800 group-hover:bg-gray-700 transition-colors' : 'py-3 px-4',
                  expandedChampion === champ.champion && column.key === 'champion' ? '!bg-gray-700/50' : '',
                ]"
              >
                <!-- Champion name + icon -->
                <div v-if="column.key === 'champion'" class="flex items-center gap-2 px-4 py-2 whitespace-nowrap">
                  <img
                    v-if="champ.championImage"
                    :src="getChampImageUrl(champ.championImage)"
                    :alt="champ.champion"
                    class="w-8 h-8 rounded"
                  />
                  <span class="font-semibold text-white">{{ champ.champion }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 ml-1 text-gray-400 transition-transform" :class="expandedChampion === champ.champion ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
                </div>

                <!-- Games -->
                <div v-else-if="column.key === 'games'">
                  <div class="font-medium text-white">{{ champ.games }}</div>
                  <div class="text-xs text-gray-500">{{ champ.wins }}W {{ champ.losses }}L</div>
                </div>

                <!-- Win Rate bar -->
                <div v-else-if="column.key === 'winRate'" class="min-w-[90px]">
                  <div class="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                    <div
                      class="h-1.5 rounded-full"
                      :class="champ.winRate >= 50 ? 'bg-blue-500' : 'bg-red-500'"
                      :style="`width: ${Math.min(100, champ.winRate).toFixed(0)}%`"
                    ></div>
                  </div>
                  <span class="text-xs">{{ champ.winRate.toFixed(1) }}%</span>
                </div>

                <!-- KDA ratio -->
                <div
                  v-else-if="column.key === 'kda'"
                  class="font-semibold"
                  :class="champ.kda >= 3.5 ? 'text-green-400' : champ.kda >= 2.5 ? 'text-yellow-400' : 'text-red-400'"
                >{{ champ.kda.toFixed(2) }}</div>

                <!-- Avg K/D/A -->
                <div v-else-if="column.key === 'avgKDA'" class="font-mono text-xs">
                  <span class="text-green-400">{{ champ.avgKills.toFixed(1) }}</span>
                  <span class="text-gray-500">/</span>
                  <span class="text-red-400">{{ champ.avgDeaths.toFixed(1) }}</span>
                  <span class="text-gray-500">/</span>
                  <span class="text-blue-400">{{ champ.avgAssists.toFixed(1) }}</span>
                </div>

                <!-- Kill Participation -->
                <span v-else-if="column.key === 'avgKillParticipation'">
                  {{ champ.avgKillParticipation?.toFixed(1) }}%
                </span>

                <!-- CS Diff (signed) -->
                <span
                  v-else-if="column.key === 'avgCsd14'"
                  :class="champ.avgCsd14 >= 0 ? 'text-green-400' : 'text-red-400'"
                >{{ champ.avgCsd14 > 0 ? '+' : '' }}{{ champ.avgCsd14?.toFixed(1) }}</span>

                <!-- 1 decimal -->
                <span v-else-if="['dpm','gpm','csm','avgCs','avgCs14','vspm','avgVisionScore','avgDamage','avgGold'].includes(column.key)">
                  {{ champ[column.key]?.toFixed(1) }}
                </span>

                <!-- Default -->
                <span v-else>{{ champ[column.key] }}</span>
              </td>
            </tr>

            <!-- Expanded match rows -->
            <tr v-if="expandedChampion === champ.champion" class="border-b border-gray-700">
              <td :colspan="visibleColumns.length" class="bg-gray-900 px-6 py-4">
                <div v-if="matchesLoading" class="flex items-center gap-2 text-gray-400 text-sm py-2">
                  <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading matches...
                </div>
                <div v-else-if="!championMatchCache[champ.champion]?.length" class="text-gray-500 text-sm py-2">No matches found.</div>
                <div v-else>
                  <p class="text-xs text-gray-500 mb-3">{{ championMatchCache[champ.champion].length }} match{{ championMatchCache[champ.champion].length !== 1 ? 'es' : '' }} on {{ champ.champion }}</p>
                  <div class="overflow-x-auto">
                    <table class="w-full text-xs text-gray-300">
                      <thead>
                        <tr class="text-gray-500 border-b border-gray-700">
                          <th class="text-left py-1.5 pr-4 font-medium">Date</th>
                          <th class="text-left py-1.5 pr-4 font-medium">Player</th>
                          <th class="text-left py-1.5 pr-4 font-medium">Team</th>
                          <th class="text-center py-1.5 pr-4 font-medium">Result</th>
                          <th class="text-center py-1.5 pr-4 font-medium">K/D/A</th>
                          <th class="text-center py-1.5 pr-4 font-medium">KDA</th>
                          <th class="text-center py-1.5 pr-4 font-medium">Kill%</th>
                          <th class="text-center py-1.5 pr-4 font-medium">CS</th>
                          <th class="text-center py-1.5 pr-4 font-medium">CS@14</th>
                          <th class="text-center py-1.5 pr-4 font-medium">Damage</th>
                          <th class="text-center py-1.5 font-medium">Vision</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="m in championMatchCache[champ.champion]"
                          :key="m.matchId"
                          class="border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors"
                          @click.stop="navigateToMatch(m.matchId)"
                        >
                          <td class="py-2 pr-4 whitespace-nowrap text-gray-400">{{ formatDate(m.gameCreation) }}</td>
                          <td class="py-2 pr-4 whitespace-nowrap">
                            <span class="text-blue-400 hover:underline" @click.stop="navigateToPlayer(m.puuid)">{{ m.playerName }}</span>
                          </td>
                          <td class="py-2 pr-4 whitespace-nowrap">{{ m.teamName }}</td>
                          <td class="py-2 pr-4 text-center font-semibold" :class="m.win ? 'text-green-400' : 'text-red-400'">{{ m.win ? 'W' : 'L' }}</td>
                          <td class="py-2 pr-4 text-center font-mono">
                            <span class="text-green-400">{{ m.kills }}</span><span class="text-gray-600">/</span><span class="text-red-400">{{ m.deaths }}</span><span class="text-gray-600">/</span><span class="text-blue-400">{{ m.assists }}</span>
                          </td>
                          <td class="py-2 pr-4 text-center" :class="m.kda >= 3.5 ? 'text-green-400' : m.kda >= 2.5 ? 'text-yellow-400' : 'text-red-400'">{{ m.kda?.toFixed(2) }}</td>
                          <td class="py-2 pr-4 text-center">{{ m.killParticipation?.toFixed(0) }}%</td>
                          <td class="py-2 pr-4 text-center">{{ m.cs }}</td>
                          <td class="py-2 pr-4 text-center">{{ m.cs14 ?? '-' }}</td>
                          <td class="py-2 pr-4 text-center">{{ m.dmg?.toLocaleString() }}</td>
                          <td class="py-2 text-center">{{ m.visionScore }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
            </template>
          </tbody>
        </table>
        <div v-if="!loading && sortedChampions.length === 0" class="py-12 text-center text-gray-500">
          No data available for this season.
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { DDRAGON_URL } from '@/config.js'

export default {
  name: 'ChampionStatsView',
  setup() {
    const loading = ref(true)
    const router = useRouter()
    const route = useRoute()
    const champions = ref([])
    const seasons = ref([])
    const selectedSeason = ref(null)
    const sortBy = ref('games')
    const sortDirection = ref('desc')
    const showColumnSelector = ref(false)
    const expandedChampion = ref(null)
    const championMatchCache = ref({})
    const matchesLoading = ref(false)

    const availableColumns = [
      { key: 'champion', label: 'Champion', align: 'left' },
      { key: 'games', label: 'Games', align: 'center' },
      { key: 'winRate', label: 'Win Rate', align: 'center' },
      { key: 'kda', label: 'KDA', align: 'center' },
      { key: 'avgKDA', label: 'K/D/A', align: 'center' },
      { key: 'avgKillParticipation', label: 'Kill Part%', align: 'center' },
      { key: 'dpm', label: 'Dmg/min', align: 'center' },
      { key: 'avgDamage', label: 'Avg Damage', align: 'center' },
      { key: 'csm', label: 'CS/min', align: 'center' },
      { key: 'avgCs', label: 'Avg CS', align: 'center' },
      { key: 'avgCs14', label: 'CS@14', align: 'center' },
      { key: 'avgCsd14', label: 'CS Diff@14', align: 'center' },
      { key: 'gpm', label: 'Gold/min', align: 'center' },
      { key: 'avgGold', label: 'Avg Gold', align: 'center' },
      { key: 'vspm', label: 'Vision/min', align: 'center' },
      { key: 'avgVisionScore', label: 'Avg Vision', align: 'center' },
      { key: 'firstBloods', label: 'First Bloods', align: 'center' },
      { key: 'soloKills', label: 'Solo Kills', align: 'center' },
      { key: 'uniquePlayersCount', label: 'Players', align: 'center' },
    ]

    const selectableColumns = computed(() => availableColumns.filter(col => col.key !== 'champion'))

    const defaultColumns = [
      'champion', 'games', 'winRate', 'kda', 'avgKDA',
      'avgKillParticipation', 'dpm', 'csm', 'avgCs14', 'avgCsd14',
      'gpm', 'vspm', 'uniquePlayersCount',
    ]

    const selectedColumns = ref([...defaultColumns])

    onMounted(async () => {
      const savedColumns = localStorage.getItem('champStatsViewColumns')
      if (savedColumns) selectedColumns.value = JSON.parse(savedColumns)

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/matches/seasons`)
        seasons.value = res.data
        if (seasons.value.length) {
          const q = route.query.season
          if (q === 'alltime') {
            selectedSeason.value = null
          } else if (q) {
            const match = seasons.value.find(s => String(s) === String(q))
            selectedSeason.value = match !== undefined ? match : seasons.value[seasons.value.length - 1]
          } else {
            selectedSeason.value = seasons.value[seasons.value.length - 1]
          }
        }
      } catch (e) {
        console.error('Failed to load seasons', e)
      }

      await loadData()
    })

    const loadData = async () => {
      loading.value = true
      try {
        const url = selectedSeason.value === null
          ? `${import.meta.env.VITE_API_URL}/matches/champion-stats/alltime`
          : `${import.meta.env.VITE_API_URL}/matches/champion-stats/season/${selectedSeason.value}`
        const res = await axios.get(url)
        champions.value = res.data
      } catch (e) {
        console.error('Failed to load champion stats', e)
      } finally {
        loading.value = false
      }
    }

    const selectSeason = async (season) => {
      selectedSeason.value = season
      expandedChampion.value = null
      championMatchCache.value = {}
      await loadData()
    }

    const toggleChampion = async (name) => {
      if (expandedChampion.value === name) {
        expandedChampion.value = null
        return
      }
      expandedChampion.value = name
      if (championMatchCache.value[name]) return
      matchesLoading.value = true
      try {
        const params = selectedSeason.value ? { season: selectedSeason.value } : {}
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/matches/champion/${encodeURIComponent(name)}/matches`, { params })
        championMatchCache.value[name] = res.data
      } catch (e) {
        console.error('Failed to load champion matches', e)
        championMatchCache.value[name] = []
      } finally {
        matchesLoading.value = false
      }
    }

    const navigateToMatch = (matchId) => {
      const id = matchId.replace('NA1_', '')
      router.push(`/match/${id}`)
    }

    const navigateToPlayer = (puuid) => router.push(`/players/${puuid}`)

    const formatDate = (ts) => {
      if (!ts) return ''
      return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const toggleColumn = (key) => {
      if (key === 'champion') return
      if (selectedColumns.value.includes(key)) {
        selectedColumns.value = selectedColumns.value.filter(c => c !== key)
      } else {
        selectedColumns.value.push(key)
      }
      localStorage.setItem('champStatsViewColumns', JSON.stringify(selectedColumns.value))
    }

    const visibleColumns = computed(() =>
      availableColumns.filter(col => selectedColumns.value.includes(col.key))
    )

    const setSort = (key) => {
      if (sortBy.value === key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortBy.value = key
        sortDirection.value = 'desc'
      }
    }

    const sortedChampions = computed(() =>
      [...champions.value].sort((a, b) => {
        const vA = a[sortBy.value]
        const vB = b[sortBy.value]
        if (typeof vA === 'string') {
          return sortDirection.value === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA)
        }
        return sortDirection.value === 'asc' ? (vA ?? 0) - (vB ?? 0) : (vB ?? 0) - (vA ?? 0)
      })
    )

    const getChampImageUrl = (image) => {
      if (!image) return ''
      return image.startsWith('http') ? image : `${DDRAGON_URL}${image}`
    }

    return {
      loading, champions, seasons, selectedSeason, selectSeason,
      sortBy, sortDirection, setSort, sortedChampions,
      showColumnSelector, availableColumns, selectableColumns,
      selectedColumns, toggleColumn, visibleColumns,
      getChampImageUrl,
      expandedChampion, championMatchCache, matchesLoading,
      toggleChampion, navigateToMatch, navigateToPlayer, formatDate,
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #1f2937; }
::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #4b5563; }
::-webkit-scrollbar-corner { background: #1f2937; }
* { scrollbar-width: thin; scrollbar-color: #374151 #1f2937; }
.overflow-x-auto.overflow-y-auto { scrollbar-gutter: stable; }
</style>
