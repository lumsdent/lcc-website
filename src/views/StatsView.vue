<template>
  <div class="container mx-auto py-6 px-4">
    <h1 class="text-2xl font-bold text-logo-blue mb-4">Player Statistics</h1>

    <!-- Sorting and Column Controls -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center">
        <label class="mr-2">Sort by:</label>
        <select v-model="sortBy" class="border bg-gray-800 rounded px-2 py-1 mr-4">
          <option v-for="column in availableColumns" :key="column.key" :value="column.key">
            {{ column.label }}
          </option>
        </select>
        <button @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'" class="border rounded px-3 py-1">
          {{ sortDirection === 'asc' ? '↑' : '↓' }}
        </button>
      </div>

      <!-- Column Selector -->
      <div class="relative">
        <button @click="showColumnSelector = !showColumnSelector"
          class="flex items-center gap-2 px-3 py-1 border rounded bg-gray-800">
          <span>Columns</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="showColumnSelector"
          class="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded shadow-lg z-10 p-2">
          <div class="flex justify-between border-b border-gray-700 pb-2 mb-2">
            <h3 class="font-medium">Select Columns</h3>
            <button @click="showColumnSelector = false" class="text-gray-500 hover:text-white">
              &times;
            </button>
          </div>
          <div class="max-h-64 overflow-y-auto">
            <label v-for="col in selectableColumns" :key="col.key"
              class="flex items-center py-1 px-2 hover:bg-gray-800">
              <input type="checkbox" :checked="selectedColumns.includes(col.key)" @change="toggleColumn(col.key)"
                class="mr-2" />
              {{ col.label }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <div class="w-16 h-16 border-4 border-logo-blue border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-400">Loading player statistics...</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full border border-gray-300 shadow-sm rounded-lg">
        <thead>
          <tr>
            <th v-for="column in visibleColumns" :key="column.key" class="py-3 px-4 border-b"
              :class="column.align === 'center' ? 'text-center' : 'text-left'">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in sortedPlayers" :key="player.puuid" class="hover:bg-gray-800 border-b cursor-pointer"
            @click="navigateToPlayer(player.puuid)">

            <!-- Render all columns in order as defined by availableColumns -->
            <td v-for="column in visibleColumns" :key="column.key" class="py-3 px-4"
              :class="column.align === 'center' ? 'text-center' : ''">

              <!-- Player Name Column -->
              <div v-if="column.key === 'playerName'" class="font-medium text-logo-blue">
                {{ player.playerName }}
              </div>

              <!-- Team Column -->
              <div v-else-if="column.key === 'team'" class="font-medium" :style="{ color: getTeamColor(player.team) }">
                {{ player.team }}
              </div>

              <!-- Role Column -->
              <div v-else-if="column.key === 'roles'" class="flex space-x-1">
                <span v-for="role in player.rolesPlayed" :key="role"
                  class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {{ formatRole(role) }}
                </span>
              </div>

              <!-- Games Column -->
              <div v-else-if="column.key === 'games'" class="text-sm">
                {{ player.games }} ({{ player.wins }}-{{ player.losses }})
              </div>

              <!-- KDA Column -->
              <div v-else-if="column.key === 'kda'" class="font-semibold" :class="getKdaColor(player.kda)">
                {{ player.kda.toFixed(1) }}
              </div>

              <!-- Win Rate Column -->
              <div v-else-if="column.key === 'winRate'">
                <div class="w-full bg-gray-200 rounded-full h-4">
                  <div class="bg-blue-600 h-4 rounded-full" :style="`width: ${player.winRate}%`"></div>
                </div>
                <span class="text-xs">{{ player.winRate.toFixed(2) }}%</span>
              </div>

              <!-- K/D/A Column -->
              <div v-else-if="column.key === 'kda_detailed'" class="text-sm">
                {{ player.kills }}/{{ player.deaths }}/{{ player.assists }}
              </div>

              <!-- Champions Column -->
              <div v-else-if="column.key === 'champions'" class="flex flex-wrap gap-1">
                <span v-for="champ in player.championsPlayed" :key="champ"
                  class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {{ champ }}
                </span>
              </div>

              <template v-else>
                <!-- CS Diff -->
                <span v-if="column.key === 'avgCsd14'">
                  {{ player.avgCsd14 > 0 ? '+' + player.avgCsd14 : player.avgCsd14 }}
                </span>

                <!-- Fixed decimal values -->
                <span
                  v-else-if="['csm', 'dpm', 'gpm', 'avgCs14', 'minutesPlayed', 'avgCS', 'avgSoloKills', 'avgHealShield', 'avgDamageTaken', 'avgGameTime'].includes(column.key)">
                  {{ player[column.key]?.toFixed(1) }}
                </span>

                <span v-else-if="column.key === 'vspm'">
                  {{ player.vspm?.toFixed(2) }}
                </span>

                <span v-else-if="column.key === 'damagePerGold'">
                  {{ player.damagePerGold ? player.damagePerGold.toFixed(2) : 'N/A' }}
                </span>

                <!-- Kill participation percentage -->
                <span v-else-if="column.key === 'killParticipation'">
                  {{ player.killParticipationPercentage.toFixed(2) }}%
                </span>

                <!-- Default display for other columns -->
                <span v-else>{{ player[column.key] }}</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
export default {
  name: 'TeamStatsView',
  setup() {
    const loading = ref(true)
    const router = useRouter()
    const players = ref([])
    const sortBy = ref('games')
    const sortDirection = ref('desc')
    const showColumnSelector = ref(false)
    
    // Define all available columns
    const availableColumns = [
      { key: 'playerName', label: 'Player', align: 'left' },
      { key: 'team', label: 'Team', align: 'left' },
      { key: 'roles', label: 'Roles', align: 'left' },
      { key: 'winRate', label: 'Win Rate', align: 'center' },
      { key: 'games', label: 'Games', align: 'center' },
      { key: "minutesPlayed", label: "Minutes Played", align: "center" },
      { key: 'avgGameTime', label: 'Avg Game Time', align: 'center' },
      
      { key: 'kills', label: 'Kills', align: 'center'},
      { key: 'deaths', label: 'Deaths', align: 'center'},
      { key: 'assists', label: 'Assists', align: 'center'},
      { key: 'kda', label: 'KDA', align: 'center' },
      { key: 'kda_detailed', label: 'K/D/A', align: 'center' },
      { key: 'killParticipation', label: 'Kill Participation', align: 'center' },

      { key: 'totalDamage', label: 'Total Damage', align: 'center'},
      { key: 'dpm', label: 'Damage/min', align: 'center' },
      { key: 'damagePerGold', label: 'Damage per Gold', align: 'center' },

      { key: 'totalCs', label: 'Total CS', align: 'center' },
      { key: 'avgCS', label: 'Avg CS', align: 'center' },
      { key: 'csm', label: 'CS/min', align: 'center' },
      { key: 'avgCs14', label: 'Avg CS@14', align: 'center' },
      { key: 'avgCsd14', label: 'Avg CS Diff@14', align: 'center' },

      { key: 'totalGold', label: 'Total Gold', align: 'center' },
      { key: 'gpm', label: 'Gold/min', align: 'center' },
      { key: 'unspentGold', label: 'Unspent Gold', align: 'center' },
      
      { key: 'visionScore', label: 'Vision', align: 'center' },
      { key: 'vspm', label: 'Vision/min', align: 'center' },
      { key: 'wardsPlaced', label: 'Wards Placed', align: 'center' },
      { key: 'wardsKilled', label: 'Wards Killed', align: 'center' },
      
      
      { key: 'firstBloods', label: 'First Bloods', align: 'center' },
      { key: 'soloKills', label: 'Solo Kills', align: 'center'},
      { key: 'avgSoloKills', label: 'Avg Solo Kills', align: 'center' },

      { key: 'avgDamageTaken', label: 'Avg Damage Taken', align: 'center' },
      { key: 'avgHealShield', label: 'Avg Heal/Shield', align: 'center' },
      
      { key: 'uniqueChampionsCount', label: 'Unique Champions', align: 'center' }
    ]

    const selectableColumns = computed(() => {
      return availableColumns.filter(col => col.key !== 'playerName')
    })

    // Default selected columns
    const selectedColumns = ref([
      'playerName',
      'team',
      'roles',
      'games',
      'kda',
      'winRate',
      'kda_detailed',
      'totalDamageDealt',
      'dpm',
      'totalCs',
      "csm",
      'avgCs14',
      'firstBloods',
      'vision',
      'uniqueChampionsCount'
    ])

    // Load saved column preferences
    onMounted(() => {
      const savedColumns = localStorage.getItem('statsViewColumns')
      if (savedColumns) {
        selectedColumns.value = JSON.parse(savedColumns)
      }
    })

    // Toggle column visibility
    const toggleColumn = (columnKey) => {
      if (columnKey === 'playerName') return // Always keep player name visible

      if (selectedColumns.value.includes(columnKey)) {
        selectedColumns.value = selectedColumns.value.filter(col => col !== columnKey)
      } else {
        selectedColumns.value.push(columnKey)
      }

      // Save preferences
      localStorage.setItem('statsViewColumns', JSON.stringify(selectedColumns.value))
    }

    // Check if column is visible
    const isColumnVisible = (columnKey) => {
      return selectedColumns.value.includes(columnKey)
    }

    // Get visible columns in order
    const visibleColumns = computed(() => {
      return availableColumns.filter(col => selectedColumns.value.includes(col.key))
    })

    const navigateToPlayer = (puuid) => {
      router.push(`/players/${puuid}`)
    }

    const loadData = async () => {
      try {
        loading.value = true
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/matches/stats/season/3`)

        console.log(response.data)

       players.value = response.data
      } catch (error) {
        console.error('Error fetching player data:', error)
      } finally {
        loading.value = false
      }
    }
    
    // Call the load data function
    loadData()
    
    const sortedPlayers = computed(() => {
      return [...players.value].sort((a, b) => {
        let valueA = a[sortBy.value]
        let valueB = b[sortBy.value]
        
        // Special case for string sorting
        if (typeof valueA === 'string') {
          return sortDirection.value === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA)
        }
        
        // Numeric sorting
        return sortDirection.value === 'asc' 
          ? valueA - valueB 
          : valueB - valueA
      })
    })

    const formatTime = (seconds) => {
      if (!seconds) return 'N/A';
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    const formatRole = (role) => {
      const roles = {
        'TOP': 'Top',
        'JUNGLE': 'Jungle',
        'MIDDLE': 'Mid',
        'BOTTOM': 'Bot',
        'SUPPORT': 'Support'
      }
      return roles[role] || role
    }
    
    const getKdaColor = (kda) => {
      if (kda >= 3.5) return 'text-green-600'
      if (kda >= 2.5) return 'text-yellow-500'
      return 'text-red-500'
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
    };

    // Color generation for teams not in the mapping
    const generatedTeamColors = ref({});

    const getTeamColor = (teamName) => {
      if (!teamName) return '#ffffff'; // Default white

      // Return predefined color if exists
      if (teamColors[teamName]) return teamColors[teamName];

      // Generate and cache color if not already done
      if (!generatedTeamColors.value[teamName]) {
        // Generate a color based on team name string
        const hash = teamName.split('').reduce((acc, char) => {
          return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        // Generate vibrant HSL color with good saturation and lightness
        const h = Math.abs(hash % 360);
        const s = 70 + Math.abs((hash >> 8) % 30); // 70-100% saturation
        const l = 55 + Math.abs((hash >> 16) % 15); // 55-70% lightness

        generatedTeamColors.value[teamName] = `hsl(${h}, ${s}%, ${l}%)`;
      }

      return generatedTeamColors.value[teamName];
    };
    
    return {
      players,
      sortBy,
      sortDirection,
      sortedPlayers,
      formatRole,
      getKdaColor,
      getTeamColor,
      navigateToPlayer,
      availableColumns,
      selectableColumns,
      selectedColumns,
      showColumnSelector,
      toggleColumn,
      isColumnVisible,
      visibleColumns,
      formatTime,
      loading
    }
  }
}
</script>

<style scoped>
/* Any additional styles can go here */
</style>