<template>
  <div class="container mx-auto px-4 py-8">

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-1">Player Statistics</h1>
      <p class="text-gray-400 text-sm">{{ selectedSeason === null ? 'All Time' : `Season ${selectedSeason}` }} Â· {{ sortedPlayers.length }} players</p>
    </div>

    <!-- Season Selector -->
    <div class="mb-6 flex flex-wrap items-center gap-2">
      <button
        @click="selectSeason(null)"
        :class="selectedSeason === null ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
        class="px-4 py-1.5 rounded-full border text-sm font-medium transition-colors"
      >All Time</button>
      <button
        v-for="season in seasons"
        :key="season"
        @click="selectSeason(season)"
        :class="selectedSeason === season ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
        class="px-4 py-1.5 rounded-full border text-sm font-medium transition-colors"
      >Season {{ season }}</button>
    </div>

    <!-- Controls bar -->
    <div class="mb-4 flex justify-end">
      <div class="relative">
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
      <p class="text-gray-400 text-sm">Loading statisticsâ€¦</p>
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
                  column.key === 'playerName' ? 'sticky left-0 z-20' : 'cursor-pointer hover:text-white',
                ]"
                @click="column.key !== 'playerName' ? setSort(column.key) : null"
              >
                {{ column.label }}
                <span v-if="sortBy === column.key" class="ml-1 text-blue-400">{{ sortDirection === 'asc' ? 'â†‘' : 'â†“' }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="player in sortedPlayers"
              :key="player.puuid"
              class="border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
              @click="navigateToPlayer(player.puuid)"
            >
              <td
                v-for="column in visibleColumns"
                :key="column.key"
                :class="[
                  column.align === 'center' ? 'text-center' : '',
                  column.key === 'playerName' ? 'sticky left-0 z-10 bg-gray-800 hover:bg-gray-700' : 'py-3 px-4',
                ]"
              >
                <!-- Player Name -->
                <div v-if="column.key === 'playerName'" class="font-semibold text-blue-400 px-4 py-3 whitespace-nowrap">
                  {{ player.playerName }}
                </div>

                <!-- Team -->
                <div v-else-if="column.key === 'team'" class="font-medium whitespace-nowrap" :style="{ color: getTeamColor(player.team) }">
                  {{ player.team }}
                </div>

                <!-- Roles -->
                <div v-else-if="column.key === 'roles'" class="flex flex-wrap gap-1">
                  <span
                    v-for="role in player.rolesPlayed"
                    :key="role"
                    class="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded"
                  >{{ formatRole(role) }}</span>
                </div>

                <!-- Games -->
                <div v-else-if="column.key === 'games'">
                  <div class="font-medium text-white">{{ player.games }}</div>
                  <div class="text-xs text-gray-500">{{ player.wins }}W {{ player.losses }}L</div>
                </div>

                <!-- Win Rate -->
                <div v-else-if="column.key === 'winRate'" class="min-w-[90px]">
                  <div class="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                    <div
                      class="h-1.5 rounded-full"
                      :class="player.winRate >= 50 ? 'bg-blue-500' : 'bg-red-500'"
                      :style="`width: ${Math.min(100, player.winRate).toFixed(0)}%`"
                    ></div>
                  </div>
                  <span class="text-xs">{{ player.winRate.toFixed(1) }}%</span>
                </div>

                <!-- KDA -->
                <div
                  v-else-if="column.key === 'kda'"
                  class="font-semibold"
                  :class="player.kda >= 3.5 ? 'text-green-400' : player.kda >= 2.5 ? 'text-yellow-400' : 'text-red-400'"
                >{{ player.kda.toFixed(2) }}</div>

                <!-- K/D/A -->
                <div v-else-if="column.key === 'kda_detailed'" class="font-mono text-xs">
                  <span class="text-green-400">{{ player.kills }}</span>
                  <span class="text-gray-500">/</span>
                  <span class="text-red-400">{{ player.deaths }}</span>
                  <span class="text-gray-500">/</span>
                  <span class="text-blue-400">{{ player.assists }}</span>
                </div>

                <!-- Kill Participation -->
                <span v-else-if="column.key === 'killParticipation'">
                  {{ player.killParticipationPercentage?.toFixed(1) }}%
                </span>

                <!-- Champions -->
                <div v-else-if="column.key === 'champions'" class="flex flex-wrap gap-1 max-w-[200px]">
                  <span
                    v-for="champ in player.championsPlayed"
                    :key="champ"
                    class="inline-block bg-gray-700 text-gray-300 text-xs px-1.5 py-0.5 rounded"
                  >{{ champ }}</span>
                </div>

                <!-- CS Diff (signed) -->
                <span
                  v-else-if="column.key === 'avgCsd14'"
                  :class="player.avgCsd14 >= 0 ? 'text-green-400' : 'text-red-400'"
                >{{ player.avgCsd14 > 0 ? '+' : '' }}{{ player.avgCsd14?.toFixed(1) }}</span>

                <!-- 1 decimal -->
                <span v-else-if="['csm','dpm','gpm','avgCs14','avgCS','avgSoloKills','avgHealShield','avgDamageTaken','avgGameTime','minutesPlayed','vspm'].includes(column.key)">
                  {{ player[column.key]?.toFixed(1) }}
                </span>

                <span v-else-if="column.key === 'damagePerGold'">{{ player.damagePerGold?.toFixed(2) ?? 'N/A' }}</span>

                <!-- Default -->
                <span v-else>{{ player[column.key] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!loading && sortedPlayers.length === 0" class="py-12 text-center text-gray-500">
          No data available for this season.
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  name: 'StatsView',
  setup() {
    const loading = ref(true)
    const router = useRouter()
    const players = ref([])
    const seasons = ref([])
    const selectedSeason = ref(null)
    const sortBy = ref('games')
    const sortDirection = ref('desc')
    const showColumnSelector = ref(false)

    const availableColumns = [
      { key: 'playerName', label: 'Player', align: 'left' },
      { key: 'team', label: 'Team', align: 'left' },
      { key: 'roles', label: 'Roles', align: 'left' },
      { key: 'winRate', label: 'Win Rate', align: 'center' },
      { key: 'games', label: 'Games', align: 'center' },
      { key: 'minutesPlayed', label: 'Minutes Played', align: 'center' },
      { key: 'avgGameTime', label: 'Avg Game Time', align: 'center' },
      { key: 'kills', label: 'Kills', align: 'center' },
      { key: 'deaths', label: 'Deaths', align: 'center' },
      { key: 'assists', label: 'Assists', align: 'center' },
      { key: 'kda', label: 'KDA', align: 'center' },
      { key: 'kda_detailed', label: 'K/D/A', align: 'center' },
      { key: 'killParticipation', label: 'Kill Part%', align: 'center' },
      { key: 'totalDamage', label: 'Total Damage', align: 'center' },
      { key: 'dpm', label: 'Dmg/min', align: 'center' },
      { key: 'damagePerGold', label: 'Dmg/Gold', align: 'center' },
      { key: 'totalCs', label: 'Total CS', align: 'center' },
      { key: 'avgCS', label: 'Avg CS', align: 'center' },
      { key: 'csm', label: 'CS/min', align: 'center' },
      { key: 'avgCs14', label: 'CS@14', align: 'center' },
      { key: 'avgCsd14', label: 'CS Diff@14', align: 'center' },
      { key: 'totalGold', label: 'Total Gold', align: 'center' },
      { key: 'gpm', label: 'Gold/min', align: 'center' },
      { key: 'unspentGold', label: 'Unspent Gold', align: 'center' },
      { key: 'visionScore', label: 'Vision', align: 'center' },
      { key: 'vspm', label: 'Vision/min', align: 'center' },
      { key: 'wardsPlaced', label: 'Wards Placed', align: 'center' },
      { key: 'wardsKilled', label: 'Wards Killed', align: 'center' },
      { key: 'firstBloods', label: 'First Bloods', align: 'center' },
      { key: 'soloKills', label: 'Solo Kills', align: 'center' },
      { key: 'avgSoloKills', label: 'Avg Solo Kills', align: 'center' },
      { key: 'avgDamageTaken', label: 'Avg Dmg Taken', align: 'center' },
      { key: 'avgHealShield', label: 'Avg Heal/Shield', align: 'center' },
      { key: 'uniqueChampionsCount', label: 'Unique Champs', align: 'center' },
    ]

    const selectableColumns = computed(() => availableColumns.filter(col => col.key !== 'playerName'))

    const selectedColumns = ref([
      'playerName', 'team', 'roles', 'games', 'winRate',
      'kda', 'kda_detailed', 'killParticipation',
      'dpm', 'csm', 'avgCs14', 'gpm', 'vspm', 'uniqueChampionsCount',
    ])

    onMounted(async () => {
      const savedColumns = localStorage.getItem('statsViewColumns')
      if (savedColumns) selectedColumns.value = JSON.parse(savedColumns)

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/matches/seasons`)
        seasons.value = res.data
        // Default to most recent season
        if (seasons.value.length) {
          selectedSeason.value = seasons.value[seasons.value.length - 1]
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
          ? `${import.meta.env.VITE_API_URL}/matches/stats/alltime`
          : `${import.meta.env.VITE_API_URL}/matches/stats/season/${selectedSeason.value}`
        const res = await axios.get(url)
        players.value = res.data
      } catch (e) {
        console.error('Failed to load stats', e)
      } finally {
        loading.value = false
      }
    }

    const selectSeason = async (season) => {
      selectedSeason.value = season
      await loadData()
    }

    const toggleColumn = (key) => {
      if (key === 'playerName') return
      if (selectedColumns.value.includes(key)) {
        selectedColumns.value = selectedColumns.value.filter(c => c !== key)
      } else {
        selectedColumns.value.push(key)
      }
      localStorage.setItem('statsViewColumns', JSON.stringify(selectedColumns.value))
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

    const sortedPlayers = computed(() =>
      [...players.value].sort((a, b) => {
        const vA = a[sortBy.value]
        const vB = b[sortBy.value]
        if (typeof vA === 'string') {
          return sortDirection.value === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA)
        }
        return sortDirection.value === 'asc' ? vA - vB : vB - vA
      })
    )

    const navigateToPlayer = (puuid) => router.push(`/players/${puuid}`)

    const formatRole = (role) => {
      const map = { TOP: 'Top', JUNGLE: 'Jungle', MIDDLE: 'Mid', BOTTOM: 'Bot', SUPPORT: 'Support' }
      return map[role] || role
    }

    const teamColors = {
      'Discord Kittens': '#872aa6',
      'Freljord Frost': '#78b4fe',
      'Bandle City Buckaroos': '#c76fa7',
      'Demacia Justice': '#fecd0b',
      'Zaun Plague': '#00d600',
      'Targon Titans': '#7e017e',
      'Noxian Gladiators': '#c63736',
      'Team Hospitalized': '#e24444',
    }
    const generatedTeamColors = ref({})
    const getTeamColor = (name) => {
      if (!name) return '#ffffff'
      if (teamColors[name]) return teamColors[name]
      if (!generatedTeamColors.value[name]) {
        const hash = name.split('').reduce((acc, c) => c.charCodeAt(0) + ((acc << 5) - acc), 0)
        generatedTeamColors.value[name] = `hsl(${Math.abs(hash % 360)}, ${70 + Math.abs((hash >> 8) % 30)}%, ${55 + Math.abs((hash >> 16) % 15)}%)`
      }
      return generatedTeamColors.value[name]
    }

    return {
      loading, players, seasons, selectedSeason, selectSeason,
      sortBy, sortDirection, setSort, sortedPlayers,
      showColumnSelector, availableColumns, selectableColumns,
      selectedColumns, toggleColumn, visibleColumns,
      navigateToPlayer, formatRole, getTeamColor,
    }
  }
}
</script>

<style scoped>
tr:hover td.sticky div { background-color: rgb(55 65 81); }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #1f2937; }
::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #4b5563; }
::-webkit-scrollbar-corner { background: #1f2937; }
* { scrollbar-width: thin; scrollbar-color: #374151 #1f2937; }
.overflow-x-auto.overflow-y-auto { scrollbar-gutter: stable; }
</style>
