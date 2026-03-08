<template>
  <div class="container mx-auto px-4 py-8">

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-1">Stats Overview</h1>
      <p class="text-gray-400 text-sm">{{ selectedSeason === null ? 'All Time' : `Season ${selectedSeason}` }} &middot; {{ playerStats.length }} players &middot; {{ championStats.length }} champions</p>
    </div>

    <!-- Season selector -->
    <div class="flex flex-wrap items-center gap-2 mb-8">
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
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24">
      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-gray-400 text-sm">Loading overview...</p>
    </div>

    <template v-else>

      <!-- Summary cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-700 rounded-xl overflow-hidden border border-gray-700 mb-10">
        <div class="bg-gray-800 px-6 py-5 text-center">
          <div class="text-2xl font-extrabold text-white">{{ totalGames }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-widest mt-1">Games</div>
        </div>
        <div class="bg-gray-800 px-6 py-5 text-center">
          <div class="text-2xl font-extrabold text-white">{{ playerStats.length }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-widest mt-1">Players</div>
        </div>
        <div class="bg-gray-800 px-6 py-5 text-center">
          <div class="text-2xl font-extrabold text-white">{{ championStats.length }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-widest mt-1">Champions</div>
        </div>
        <div class="bg-gray-800 px-6 py-5 text-center">
          <div class="text-2xl font-extrabold text-white">{{ avgKda }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-widest mt-1">Avg KDA</div>
        </div>
      </div>

      <!-- Navigation cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <router-link
          :to="{ path: '/stats/player', query: selectedSeason !== null ? { season: selectedSeason } : { season: 'alltime' } }"
          class="group flex items-center gap-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 px-5 py-4 transition-all duration-200 hover:shadow-lg"
        >
          <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Player Stats</div>
            <div class="text-xs text-gray-500">KDA, damage, CS, win rates per player</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600 group-hover:text-blue-400 ml-auto shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>

        <router-link
          :to="{ path: '/stats/champion', query: selectedSeason !== null ? { season: selectedSeason } : { season: 'alltime' } }"
          class="group flex items-center gap-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 px-5 py-4 transition-all duration-200 hover:shadow-lg"
        >
          <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Champion Stats</div>
            <div class="text-xs text-gray-500">Win rates, KDA, damage per champion</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600 group-hover:text-blue-400 ml-auto shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Charts row 1: Player leaderboards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        <!-- Top KDA -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 class="text-sm font-semibold text-white mb-4">Top Players by KDA <span v-if="selectedSeason === null" class="text-gray-500 font-normal">(min 3 games)</span></h2>
          <div class="h-72">
            <Bar :data="kdaChartData" :options="horizontalBarOptions" />
          </div>
        </div>

        <!-- Top DPM -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 class="text-sm font-semibold text-white mb-4">Top Players by Damage / min <span v-if="selectedSeason === null" class="text-gray-500 font-normal">(min 3 games)</span></h2>
          <div class="h-72">
            <Bar :data="dpmChartData" :options="horizontalBarOptions" />
          </div>
        </div>

      </div>

      <!-- Charts row 2: Win rate + Games -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        <!-- Top win rate (min 3 games) -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 class="text-sm font-semibold text-white mb-1">Top Win Rate <span class="text-gray-500 font-normal">(min 3 games)</span></h2>
          <div class="h-72">
            <Bar :data="winRateChartData" :options="winRateBarOptions" />
          </div>
        </div>

        <!-- Most unique champions played -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 class="text-sm font-semibold text-white mb-4">Most Unique Champions Played <span v-if="selectedSeason === null" class="text-gray-500 font-normal">(min 3 games)</span></h2>
          <div class="h-72">
            <Bar :data="uniqueChampsChartData" :options="horizontalBarOptions" />
          </div>
        </div>

      </div>

      <!-- Charts row 3: Champion charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        <!-- Most played champs -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 class="text-sm font-semibold text-white mb-4">Most Played Champions</h2>
          <div class="space-y-2">
            <div
              v-for="(champ, i) in topChampsByGames"
              :key="champ.champion"
              class="flex items-center gap-3"
            >
              <span class="text-xs text-gray-500 w-4 text-right shrink-0">{{ i + 1 }}</span>
              <img v-if="champ.championImage" :src="getChampImageUrl(champ.championImage)" class="w-6 h-6 rounded shrink-0" />
              <span class="text-sm text-gray-300 w-28 truncate shrink-0">{{ champ.champion }}</span>
              <div class="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  class="h-2 rounded-full bg-blue-500"
                  :style="`width: ${(champ.games / topChampsByGames[0].games) * 100}%`"
                ></div>
              </div>
              <span class="text-xs text-gray-400 w-8 text-right shrink-0">{{ champ.games }}</span>
            </div>
          </div>
        </div>

        <!-- Highest win rate champs (min 3 games) -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 class="text-sm font-semibold text-white mb-1">Champion Win Rate <span class="text-gray-500 font-normal">(min 3 games)</span></h2>
          <div class="space-y-2 mt-3">
            <div
              v-for="(champ, i) in topChampsByWinRate"
              :key="champ.champion"
              class="flex items-center gap-3"
            >
              <span class="text-xs text-gray-500 w-4 text-right shrink-0">{{ i + 1 }}</span>
              <img v-if="champ.championImage" :src="getChampImageUrl(champ.championImage)" class="w-6 h-6 rounded shrink-0" />
              <span class="text-sm text-gray-300 w-28 truncate shrink-0">{{ champ.champion }}</span>
              <div class="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  class="h-2 rounded-full"
                  :class="champ.winRate >= 50 ? 'bg-blue-500' : 'bg-red-500'"
                  :style="`width: ${champ.winRate}%`"
                ></div>
              </div>
              <span class="text-xs w-12 text-right shrink-0" :class="champ.winRate >= 50 ? 'text-blue-400' : 'text-red-400'">{{ champ.winRate.toFixed(0) }}%</span>
            </div>
          </div>
        </div>

      </div>

      <!-- KDA Trends line chart (regular seasons only) -->
      <div class="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
        <h2 class="text-sm font-semibold text-white mb-1">
          KDA Trends — Regular Seasons
          <span class="text-gray-500 font-normal">(top 5 most improved)</span>
        </h2>
        <p class="text-xs text-gray-500 mb-4">Players ranked by KDA increase from their first to last regular season played</p>

        <div v-if="loadingTrends" class="flex items-center justify-center h-56">
          <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="lineChartData.datasets.length === 0" class="flex items-center justify-center h-56">
          <p class="text-gray-500 text-sm">Not enough data to display trends.</p>
        </div>
        <div v-else class="h-72">
          <Line :data="lineChartData" :options="lineOptions" />
        </div>
      </div>

    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Bar, Line } from 'vue-chartjs'
import { DDRAGON_URL } from '@/config.js'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale,
  PointElement, LineElement, Filler,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler)

const CHART_COLORS = {
  blue: 'rgba(59, 130, 246, 0.85)',
  blueHover: 'rgba(96, 165, 250, 1)',
  green: 'rgba(34, 197, 94, 0.85)',
  red: 'rgba(239, 68, 68, 0.85)',
  grid: 'rgba(55, 65, 81, 0.8)',
  text: 'rgba(156, 163, 175, 1)',
}

export default {
  name: 'StatsOverviewView',
  components: { Bar, Line },
  setup() {
    const loading = ref(true)
    const playerStats = ref([])
    const championStats = ref([])
    const seasons = ref([])
    const selectedSeason = ref(null)
    const allSeasonsData = ref({})
    const loadingTrends = ref(false)

    const getChampImageUrl = (image) => {
      if (!image) return ''
      return image.startsWith('http') ? image : `${DDRAGON_URL}${image}`
    }

    onMounted(async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/matches/seasons`)
        seasons.value = res.data
      } catch (e) { console.error(e) }
      await loadData()
      loadSeasonTrends()
    })

    const loadData = async () => {
      loading.value = true
      try {
        const base = import.meta.env.VITE_API_URL
        const season = selectedSeason.value
        const [pRes, cRes] = await Promise.all([
          axios.get(season ? `${base}/matches/stats/season/${season}` : `${base}/matches/stats/alltime`),
          axios.get(season ? `${base}/matches/champion-stats/season/${season}` : `${base}/matches/champion-stats/alltime`),
        ])
        playerStats.value = pRes.data
        championStats.value = cRes.data
      } catch (e) { console.error(e) }
      finally { loading.value = false }
    }

    const selectSeason = async (season) => {
      selectedSeason.value = season
      await loadData()
    }

    // Load each regular season (no T/P) in parallel for trend chart
    const regularSeasons = computed(() =>
      seasons.value.filter(s => !/[TP]/i.test(String(s)))
    )

    const loadSeasonTrends = async () => {
      if (!seasons.value.length) return
      loadingTrends.value = true
      try {
        const base = import.meta.env.VITE_API_URL
        const results = await Promise.all(
          regularSeasons.value.map(s =>
            axios.get(`${base}/matches/stats/season/${s}`).then(r => ({ season: s, data: r.data }))
          )
        )
        const obj = {}
        results.forEach(({ season, data }) => { obj[season] = data })
        allSeasonsData.value = obj
      } catch (e) { console.error(e) }
      finally { loadingTrends.value = false }
    }

    // Summary stats
    const totalGames = computed(() => {
      if (!playerStats.value.length) return 0
      return Math.round(playerStats.value.reduce((s, p) => s + p.games, 0) / 10)
    })

    const avgKda = computed(() => {
      if (!playerStats.value.length) return '—'
      const avg = playerStats.value.reduce((s, p) => s + p.kda, 0) / playerStats.value.length
      return avg.toFixed(2)
    })

    // Player chart helpers — apply 3-game minimum for all-time to filter noise
    const qualifiedPlayers = computed(() => {
      const minGames = selectedSeason.value === null ? 3 : 1
      return playerStats.value.filter(p => p.games >= minGames)
    })

    const top10By = (field, n = 10) =>
      [...qualifiedPlayers.value].sort((a, b) => b[field] - a[field]).slice(0, n)

    const makeBarData = (items, labelFn, valueFn, colors) => ({
      labels: items.map(labelFn),
      datasets: [{
        data: items.map(valueFn),
        backgroundColor: colors ?? items.map(() => CHART_COLORS.blue),
        borderRadius: 4,
        borderSkipped: false,
      }],
    })

    const kdaChartData = computed(() => {
      const players = top10By('kda')
      return makeBarData(players, p => p.playerName, p => parseFloat(p.kda.toFixed(2)),
        players.map(p => p.kda >= 3.5 ? CHART_COLORS.green : p.kda >= 2.5 ? 'rgba(234,179,8,0.85)' : CHART_COLORS.red)
      )
    })

    const dpmChartData = computed(() => {
      const players = top10By('dpm')
      return makeBarData(players, p => p.playerName, p => parseFloat(p.dpm.toFixed(1)))
    })

    const winRateChartData = computed(() => {
      const players = [...qualifiedPlayers.value]
        .filter(p => p.games >= 3)
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 10)
      return makeBarData(players, p => p.playerName, p => parseFloat(p.winRate.toFixed(1)),
        players.map(p => p.winRate >= 50 ? CHART_COLORS.blue : CHART_COLORS.red)
      )
    })

    const uniqueChampsChartData = computed(() => {
      const players = top10By('uniqueChampionsCount')
      return makeBarData(players, p => p.playerName, p => p.uniqueChampionsCount)
    })

    const horizontalBarOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f9fafb',
          bodyColor: '#9ca3af',
          borderColor: '#374151',
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: { color: CHART_COLORS.grid },
          ticks: { color: CHART_COLORS.text, font: { size: 11 } },
        },
        y: {
          grid: { display: false },
          ticks: { color: '#e5e7eb', font: { size: 11 } },
        },
      },
    }

    const winRateBarOptions = {
      ...horizontalBarOptions,
      scales: {
        ...horizontalBarOptions.scales,
        x: {
          ...horizontalBarOptions.scales.x,
          min: 0,
          max: 100,
          ticks: {
            ...horizontalBarOptions.scales.x.ticks,
            callback: (v) => v + '%',
          },
        },
      },
    }

    // Champion lists
    const topChampsByGames = computed(() =>
      [...championStats.value].sort((a, b) => b.games - a.games).slice(0, 10)
    )

    const topChampsByWinRate = computed(() =>
      [...championStats.value]
        .filter(c => c.games >= 3)
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 10)
    )

    // Line chart: season KDA trends for top 5 most-improved players
    const LINE_PALETTE = [
      'rgba(59,130,246,1)', 'rgba(34,197,94,1)', 'rgba(234,179,8,1)',
      'rgba(239,68,68,1)', 'rgba(168,85,247,1)',
    ]

    const lineChartData = computed(() => {
      const keys = regularSeasons.value
      if (!keys.length || !Object.keys(allSeasonsData.value).length) return { labels: [], datasets: [] }

      // Build per-player KDA map: { puuid: { name, seasons: { s: kda } } }
      const playerMap = {}
      keys.forEach(s => {
        ;(allSeasonsData.value[s] ?? []).forEach(p => {
          if (!playerMap[p.puuid]) playerMap[p.puuid] = { name: p.playerName, seasons: {} }
          playerMap[p.puuid].seasons[s] = p.kda
        })
      })

      // Only consider players present in first AND last regular season
      const first = keys[0]
      const last = keys[keys.length - 1]
      const eligible = Object.entries(playerMap).filter(
        ([, v]) => v.seasons[first] != null && v.seasons[last] != null
      )

      // Sort by KDA increase (last - first), take top 5
      const top5 = eligible
        .map(([puuid, v]) => ({ puuid, name: v.name, seasons: v.seasons, delta: v.seasons[last] - v.seasons[first] }))
        .sort((a, b) => b.delta - a.delta)
        .slice(0, 5)

      const datasets = top5.map((player, i) => ({
        label: `${player.name} (+${player.delta.toFixed(2)})`,
        data: keys.map(s => player.seasons[s] != null ? parseFloat(player.seasons[s].toFixed(2)) : null),
        borderColor: LINE_PALETTE[i],
        backgroundColor: LINE_PALETTE[i].replace('1)', '0.1)'),
        pointBackgroundColor: LINE_PALETTE[i],
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        spanGaps: false,
        tension: 0.3,
      }))

      return { labels: keys.map(s => `Season ${s}`), datasets }
    })

    const lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { color: CHART_COLORS.text, boxWidth: 12, font: { size: 11 }, padding: 12 },
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f9fafb',
          bodyColor: '#9ca3af',
          borderColor: '#374151',
          borderWidth: 1,
          callbacks: { label: (item) => ` KDA: ${item.raw}` },
        },
      },
      scales: {
        x: {
          grid: { color: CHART_COLORS.grid },
          ticks: { color: CHART_COLORS.text, font: { size: 11 } },
        },
        y: {
          grid: { color: CHART_COLORS.grid },
          ticks: { color: CHART_COLORS.text, font: { size: 11 } },
          title: { display: true, text: 'KDA', color: CHART_COLORS.text, font: { size: 11 } },
        },
      },
    }

    return {
      loading, loadingTrends, playerStats, championStats, seasons, selectedSeason, selectSeason,
      totalGames, avgKda,
      kdaChartData, dpmChartData, winRateChartData, uniqueChampsChartData,
      lineChartData, lineOptions,
      horizontalBarOptions, winRateBarOptions,
      topChampsByGames, topChampsByWinRate, getChampImageUrl,
    }
  }
}
</script>
