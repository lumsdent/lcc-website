<template>
  <div class="p-6 max-w-7xl mx-auto">

    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white mb-2">Matches</h1>
      <p class="text-gray-400">{{ filteredMatches.length }} match{{ filteredMatches.length !== 1 ? 'es' : '' }}
        <span v-if="seasonFilter !== null"> in Season {{ seasonFilter }}</span>
      </p>
    </div>

    <!-- Season Filter -->
    <div class="mb-6 flex flex-wrap justify-center gap-2">
      <button
        @click="seasonFilter = null"
        :class="seasonFilter === null
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
        class="px-4 py-1.5 rounded-full border text-sm font-medium transition-colors"
      >
        All Seasons
      </button>
      <button
        v-for="s in availableSeasons"
        :key="s"
        @click="seasonFilter = s"
        :class="seasonFilter === s
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
        class="px-4 py-1.5 rounded-full border text-sm font-medium transition-colors"
      >
        Season {{ s }}
      </button>
    </div>

    <!-- Search & Filters Row -->
    <div class="mb-8 flex flex-wrap gap-3 items-end">
      <!-- Team Filter -->
      <div class="flex-1 min-w-[180px]">
        <label class="block text-xs text-gray-500 mb-1">Team</label>
        <select
          v-model="teamFilter"
          class="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Teams</option>
          <option v-for="name in availableTeamNames" :key="name" :value="name">{{ name }}</option>
        </select>
      </div>

      <!-- Date Range -->
      <div class="flex-1 min-w-[260px]">
        <label class="block text-xs text-gray-500 mb-1">Date Range</label>
        <div class="flex gap-2">
          <input
            v-model="dateFrom"
            type="date"
            class="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          <input
            v-model="dateTo"
            type="date"
            class="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Duration Range -->
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs text-gray-500 mb-1">Duration (min)</label>
        <div class="flex gap-2">
          <input
            v-model.number="durationMin"
            type="number"
            min="0"
            placeholder="Min"
            class="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <input
            v-model.number="durationMax"
            type="number"
            min="0"
            placeholder="Max"
            class="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Clear Filters -->
      <button
        v-if="teamFilter || dateFrom || dateTo || durationMin || durationMax || seasonFilter !== null"
        @click="clearFilters"
        class="px-4 py-2 text-sm text-gray-400 border border-gray-600 rounded-lg hover:border-gray-400 hover:text-white transition-colors"
      >
        Clear
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Match Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="match in filteredMatches"
        :key="match.metadata.matchId"
        class="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-500 cursor-pointer transition-all duration-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl"
        @click="navigateToMatch(match.metadata.matchId)"
      >
        <!-- Date bar -->
        <div class="px-4 pt-3 pb-1 text-xs text-gray-500">
          {{ formatDate(match.info.gameCreation) }}
        </div>

        <!-- Teams -->
        <div class="flex items-center justify-between px-3 py-2 gap-2">
          <!-- Team 1 -->
          <div class="flex flex-col items-center flex-1 min-w-0">
            <img
              :src="getTeamLogo(match.info.teams[0].name)"
              class="w-14 h-14 object-contain rounded-xl mb-1"
              :alt="match.info.teams[0].name"
            />
            <span class="hidden sm:block text-xs font-semibold text-white text-center truncate w-full">{{ match.info.teams[0].name }}</span>
            <span class="sm:hidden text-xs font-bold text-white">{{ getTeamTricode(match.info.teams[0].name) }}</span>
            <span class="text-xs font-bold mt-0.5" :class="match.info.teams[0].gameOutcome ? 'text-green-400' : 'text-red-400'">
              {{ match.info.teams[0].gameOutcome ? 'WIN' : 'LOSS' }}
            </span>
          </div>

          <!-- VS + Duration -->
          <div class="flex flex-col items-center shrink-0 gap-1">
            <span class="text-lg font-extrabold text-gray-300 tracking-widest">VS</span>
            <span class="text-xs text-gray-500 font-mono">{{ formatDuration(match.info.gameDuration) }}</span>
          </div>

          <!-- Team 2 -->
          <div class="flex flex-col items-center flex-1 min-w-0">
            <img
              :src="getTeamLogo(match.info.teams[1].name)"
              class="w-14 h-14 object-contain rounded-xl mb-1"
              :alt="match.info.teams[1].name"
            />
            <span class="hidden sm:block text-xs font-semibold text-white text-center truncate w-full">{{ match.info.teams[1].name }}</span>
            <span class="sm:hidden text-xs font-bold text-white">{{ getTeamTricode(match.info.teams[1].name) }}</span>
            <span class="text-xs font-bold mt-0.5" :class="match.info.teams[1].gameOutcome ? 'text-green-400' : 'text-red-400'">
              {{ match.info.teams[1].gameOutcome ? 'WIN' : 'LOSS' }}
            </span>
          </div>
        </div>

        <!-- Stats Footer -->
        <div class="flex justify-between items-center border-t border-gray-700 px-4 py-2 text-xs">
          <div class="text-center">
            <div class="font-bold text-white">{{ match.info.teams[0].kills }}</div>
            <div class="text-gray-500">Kills</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-gray-400">{{ match.info.gameVersion }}</div>
            <div class="text-gray-500">Patch</div>
          </div>
          <div class="text-center">
            <div class="font-bold text-white">{{ match.info.teams[1].kills }}</div>
            <div class="text-gray-500">Kills</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredMatches.length === 0" class="text-center py-16 text-gray-500">
      {{ matches.length === 0 ? 'No matches found.' : 'No matches match your filters.' }}
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import teamsData from '@/data/teamsData.json'

export default {
  name: 'MatchView',
  setup() {
    const router = useRouter()
    const matches = ref([])
    const loading = ref(true)
    const seasonFilter = ref(null)
    const teamFilter = ref('')
    const dateFrom = ref('')
    const dateTo = ref('')
    const durationMin = ref(null)
    const durationMax = ref(null)

    const getMatchSeason = (gameVersion) => {
      const major = parseInt(gameVersion?.split('.')[0] ?? '0')
      if (major <= 14) return 2
      if (major === 15) return 3
      if (major >= 16) return 4
      return null
    }

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatDuration = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    const getTeamLogo = (teamName) => {
      const teamLogos = {
        'Bandle City Buckaroos': 'Bandle_City_Buckaroos.png',
        'Bilgewater Bullets': '/Bilgewater_Bullets_Logo.png',
        'Demacian Justice': 'Demacian_Justice_Logo.png',
        'Freljord Frost': 'Frejlord_Frost_Logo.png',
        'Noxian Gladiators': 'Noxian_Gladiators_Logo.png',
        'Piltover Progress': 'Piltover_Progress_Logo.png',
        'Shurima Scorch': 'Shuriman_Scorch_Logo.png',
        'Targon Titans': 'Targon_Titans_Logo.png',
        'Zaun Plague': 'Zaun_Plague.png',
        'Discord Kittens': 'Discord Kittens Logo.svg',
        'Gets On Base': 'Gets On Base Logo.svg',
        'League of Liquor': 'League of Liquor Logo.svg',
        "Matt's Alt Accounts": 'M.A.A. Logo.svg',
        'S.G.I.': 'S.G.I. Logo.svg',
        'Team Bell': 'Team Bell Logo.svg',
        'Team Hospitalized': 'Team Hospitalized Logo.svg',
      }
      try {
        return new URL(`../assets/teams/${teamLogos[teamName]}`, import.meta.url).href
      } catch {
        return ''
      }
    }

    const getTeamTricode = (teamName) => {
      const team = teamsData.teams.find(t => t.name === teamName)
      return team?.tricode ?? teamName
    }

    const sortedMatches = computed(() =>
      [...matches.value].sort((a, b) => new Date(b.info.gameCreation) - new Date(a.info.gameCreation))
    )

    const availableSeasons = computed(() => {
      const seasons = new Set(matches.value.map(m => getMatchSeason(m.info.gameVersion)).filter(Boolean))
      return [...seasons].sort((a, b) => a - b)
    })

    const availableTeamNames = computed(() => {
      const names = new Set()
      matches.value.forEach(m => {
        m.info.teams.forEach(t => names.add(t.name))
      })
      return [...names].sort()
    })

    const filteredMatches = computed(() => {
      return sortedMatches.value.filter(match => {
        // Season filter
        if (seasonFilter.value !== null && getMatchSeason(match.info.gameVersion) !== seasonFilter.value) return false

        // Team filter
        if (teamFilter.value && !match.info.teams.some(t => t.name === teamFilter.value)) return false

        // Date range
        const matchDate = new Date(match.info.gameCreation)
        if (dateFrom.value && matchDate < new Date(dateFrom.value)) return false
        if (dateTo.value && matchDate > new Date(dateTo.value + 'T23:59:59')) return false

        // Duration range (in minutes)
        const durationSecs = match.info.gameDuration
        if (durationMin.value && durationSecs < durationMin.value * 60) return false
        if (durationMax.value && durationSecs > durationMax.value * 60) return false

        return true
      })
    })

    const clearFilters = () => {
      seasonFilter.value = null
      teamFilter.value = ''
      dateFrom.value = ''
      dateTo.value = ''
      durationMin.value = null
      durationMax.value = null
    }

    const navigateToMatch = (matchId) => {
      router.push(`/match/${matchId}`)
    }

    onMounted(async () => {
      try {
        loading.value = true
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/matches`)
        matches.value = response.data || []
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        loading.value = false
      }
    })

    return {
      matches,
      sortedMatches,
      filteredMatches,
      loading,
      seasonFilter,
      teamFilter,
      dateFrom,
      dateTo,
      durationMin,
      durationMax,
      availableSeasons,
      availableTeamNames,
      clearFilters,
      formatDate,
      formatDuration,
      getTeamLogo,
      getTeamTricode,
      navigateToMatch
    }
  }
}
</script>