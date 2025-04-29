<template>
  <div class="container mx-auto py-6 px-4">
    <h1 class="text-2xl font-bold text-logo-blue mb-4">Player Statistics</h1>

    <!-- Sorting Controls -->
    <div class="mb-4 flex items-center">
      <label class="mr-2">Sort by:</label>
      <select v-model="sortBy" class="border bg-gray-800 rounded px-2 py-1 mr-4">
        <option value="playerName">Player Name</option>
        <option value="kda">KDA</option>
        <option value="winRate">Win Rate</option>
        <option value="avgDamage">Avg Damage</option>
        <option value="avgCS">Avg CS</option>
        <option value="games">Games Played</option>
      </select>
      <button @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'" class="border rounded px-3 py-1 ">
        {{ sortDirection === 'asc' ? '↑' : '↓' }}
      </button>
    </div>

    <!-- Stats Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full  border border-gray-300 shadow-sm rounded-lg">
        <thead>
          <tr class="">
            <th class="py-3 px-4 text-left border-b">Player</th>
            <th class="py-3 px-4 text-left border-b">Role</th>
            <th class="py-3 px-4 text-center border-b">KDA</th>
            <th class="py-3 px-4 text-center border-b">Win Rate</th>
            <th class="py-3 px-4 text-center border-b">Games</th>
            <th class="py-3 px-4 text-center border-b">K/D/A</th>
            <th class="py-3 px-4 text-center border-b">Avg CS</th>
            <th class="py-3 px-4 text-center border-b">Avg Damage</th>
            <th class="py-3 px-4 text-center border-b">Vision</th>
            <th class="py-3 px-4 text-center border-b">Champions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in sortedPlayers" :key="player.puuid" class="hover:bg-gray-800 border-b cursor-pointer"
            @click="navigateToPlayer(player.puuid)">
            <td class="py-3 px-4">
              <div class="font-medium text-logo-blue">{{ player.playerName }}</div>
            </td>
            <td class="py-3 px-4">
              <div class="flex space-x-1">
                <span v-for="role in player.preferredRoles" :key="role"
                  class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {{ formatRole(role) }}
                </span>
              </div>
            </td>
            <td class="py-3 px-4 text-center font-semibold" :class="getKdaColor(player.kda)">
              {{ player.kda.toFixed(1) }}
            </td>
            <td class="py-3 px-4 text-center">
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div class="bg-blue-600 h-4 rounded-full" :style="`width: ${player.winRate}%`"></div>
              </div>
              <span class="text-xs">{{ player.winRate }}%</span>
            </td>
            <td class="py-3 px-4 text-center">
              <div class="text-sm">
                {{ player.games }} ({{ player.wins }}-{{ player.losses }})
              </div>
            </td>
            <td class="py-3 px-4 text-center">
              <div class="text-sm">{{ player.kills }}/{{ player.deaths }}/{{ player.assists }}</div>
            </td>
            <td class="py-3 px-4 text-center">{{ player.avgCS }}</td>
            <td class="py-3 px-4 text-center">{{ player.avgDamage.toLocaleString() }}</td>
            <td class="py-3 px-4 text-center">{{ player.avgVisionScore }}</td>
            <td class="py-3 px-4">
              <div class="flex flex-wrap gap-1">
                <span v-for="champ in player.championsPlayed" :key="champ"
                  class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {{ champ }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
export default {
  name: 'TeamStatsView',
  setup() {
    const router = useRouter()
    const players = ref([])
    const sortBy = ref('kda')
    const sortDirection = ref('desc')
    
    const navigateToPlayer = (puuid) => {
      router.push(`/players/${puuid}`)
    }

    const loadData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/matches/stats/season/3`)

        console.log(response.data)

       players.value = response.data
      } catch (error) {
        console.error('Error fetching player data:', error)
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
    
    return {
      players,
      sortBy,
      sortDirection,
      sortedPlayers,
      formatRole,
      getKdaColor,
      navigateToPlayer
    }
  }
}
</script>

<style scoped>
/* Any additional styles can go here */
</style>