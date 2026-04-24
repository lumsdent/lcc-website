<template>
  <div class="p-6 max-w-5xl mx-auto">

    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white mb-2">Standings</h1>
      <p class="text-gray-400">Season records and team rankings</p>
    </div>

    <!-- Season Tabs -->
    <div class="mb-8 flex flex-wrap justify-center gap-2">
      <button
        v-for="s in regularSeasons"
        :key="s.id"
        @click="selectSeason(s.id)"
        :class="selectedSeason === s.id
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
        class="px-4 py-1.5 rounded-full border text-sm font-medium transition-colors"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-16 text-red-400">
      Failed to load standings. Please try again.
    </div>

    <!-- Empty -->
    <div v-else-if="!loading && standings.length === 0" class="text-center py-16 text-gray-500">
      No match data found for this season.
    </div>

    <!-- Table -->
    <div v-else class="rounded-xl overflow-hidden border border-gray-700">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-800 border-b border-gray-700 text-gray-400 uppercase tracking-widest text-xs">
            <th class="py-3 px-4 text-center w-12">#</th>
            <th class="py-3 px-4 text-left">Team</th>
            <th class="py-3 px-4 text-center">W</th>
            <th class="py-3 px-4 text-center">L</th>
            <th class="py-3 px-4 text-center">GP</th>
            <th class="py-3 px-4 text-center">W%</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(team, index) in standings"
            :key="team.teamName"
            class="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer transition-colors"
            :class="index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/60'"
            @click="navigateToTeam(team.teamName)"
          >
            <!-- Rank -->
            <td class="py-3 px-4 text-center">
              <span
                class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                :class="rankClass(index)"
              >
                {{ index + 1 }}
              </span>
            </td>

            <!-- Team -->
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <TeamLogo
                  :teamName="team.teamName"
                  :season="selectedSeason"
                  class="w-8 h-8 object-contain flex-shrink-0"
                />
                <div>
                  <span class="text-white font-semibold">{{ team.teamName }}</span>
                  <span
                    v-if="resolveCurrentName(team.teamName) !== team.teamName"
                    class="ml-2 text-xs text-gray-500"
                  >
                    now {{ resolveCurrentName(team.teamName) }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Wins -->
            <td class="py-3 px-4 text-center font-bold text-green-400">{{ team.wins }}</td>

            <!-- Losses -->
            <td class="py-3 px-4 text-center font-bold text-red-400">{{ team.losses }}</td>

            <!-- Games Played -->
            <td class="py-3 px-4 text-center text-gray-400">{{ team.games }}</td>

            <!-- Win Rate -->
            <td class="py-3 px-4 text-center">
              <span :class="winRateClass(team.winRate)">
                {{ formatWinRate(team.winRate) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { SEASONS } from '@/config.js'
import teamsDataJson from '@/data/teamsData.json'
import TeamLogo from '@/components/TeamLogo.vue'

export default {
  name: 'StandingsView',
  components: { TeamLogo },
  setup() {
    const router = useRouter()

    // Only show regular seasons (no tiebreakers or playoffs)
    const regularSeasons = computed(() => {
      return SEASONS
        .filter(s => !/[TP]$/.test(s.id))
        .map(s => ({ id: s.id, label: `Season ${s.id}` }))
    })

    const latestSeason = computed(() => {
      const all = regularSeasons.value
      return all.length ? all[all.length - 1].id : null
    })

    const selectedSeason = ref(null)
    const standings = ref([])
    const loading = ref(false)
    const error = ref(false)

    // Build a lookup: former name → current name  (and current → current as fallback)
    const nameMap = computed(() => {
      const map = {}
      for (const team of teamsDataJson.teams) {
        map[team.name] = team.name
        if (team.formerName) {
          map[team.formerName] = team.name
        }
      }
      return map
    })

    const resolveCurrentName = (rawName) => {
      return nameMap.value[rawName] ?? rawName
    }

    // For navigating to team detail, look up the team id from teamsData
    const resolveTeamId = (rawName) => {
      const currentName = resolveCurrentName(rawName)
      const found = teamsDataJson.teams.find(t => t.name === currentName)
      return found?.id ?? null
    }

    const fetchStandings = async (season) => {
      if (!season) return
      loading.value = true
      error.value = false
      standings.value = []
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/standings/${season}`)
        standings.value = response.data
      } catch (e) {
        console.error('Error fetching standings:', e)
        error.value = true
      } finally {
        loading.value = false
      }
    }

    const selectSeason = (seasonId) => {
      selectedSeason.value = seasonId
      fetchStandings(seasonId)
    }

    const navigateToTeam = (rawName) => {
      const id = resolveTeamId(rawName)
      if (id) router.push(`/teams/${id}`)
    }

    const formatWinRate = (rate) => {
      return (rate * 100).toFixed(1) + '%'
    }

    const winRateClass = (rate) => {
      if (rate >= 0.6) return 'text-green-400 font-semibold'
      if (rate <= 0.4) return 'text-red-400'
      return 'text-gray-300'
    }

    const rankClass = (index) => {
      if (index === 0) return 'bg-yellow-500/20 text-yellow-400'
      if (index === 1) return 'bg-gray-500/20 text-gray-300'
      if (index === 2) return 'bg-orange-700/20 text-orange-400'
      return 'bg-gray-700/40 text-gray-500'
    }

    onMounted(() => {
      selectedSeason.value = latestSeason.value
      fetchStandings(latestSeason.value)
    })

    return {
      regularSeasons,
      selectedSeason,
      standings,
      loading,
      error,
      selectSeason,
      navigateToTeam,
      resolveCurrentName,
      formatWinRate,
      winRateClass,
      rankClass,
    }
  }
}
</script>
