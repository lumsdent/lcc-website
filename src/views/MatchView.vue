<template>
  <div class="container mx-auto py-6 px-4">
    <h1 class="text-2xl font-bold text-logo-blue mb-6">Recent Matches</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="match in sortedMatches" :key="match.metadata.matchId" 
           class="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
           @click="navigateToMatch(match.metadata.matchId)">
        
        <!-- Match Card Content -->
        <div class="p-4">
          <!-- Date and Time -->
          <div class="text-gray-400 text-sm mb-3">
            {{ formatDate(match.info.gameCreation) }}
          </div>
          
          <!-- Teams Display -->
          <div class="flex items-center justify-between">
            <!-- Blue Team -->
            <div class="flex flex-col items-center w-2/5">
              <div class="w-16 h-16 mb-2 flex items-center justify-center">
                <img :src="getTeamLogo(match.info.teams[0].name)" 
                     alt="Blue Team" 
                     class="max-w-full max-h-full blue-team-logo">
              </div>
              <div class="text-center font-bold text-blue-400">
                {{ match.info.teams[0].name }}
              </div>
              <div class="text-sm mt-1" :class="match.info.teams[0].gameOutcome ? 'text-green-500' : 'text-red-500'">
                {{ match.info.teams[0].gameOutcome ? 'VICTORY' : 'DEFEAT' }}
              </div>
            </div>
            
            <!-- VS Icon -->
            <div class="flex flex-col items-center">
              <div class="text-2xl font-bold text-gray-300">VS</div>
              <div class="text-xs text-gray-400 mt-2">
                {{ formatDuration(match.info.gameDuration) }}
              </div>
            </div>
            
            <!-- Red Team -->
            <div class="flex flex-col items-center w-2/5">
              <div class="w-16 h-16 mb-2 flex items-center justify-center">
                <img :src="getTeamLogo(match.info.teams[1].name)" 
                     alt="Red Team" 
                     class="max-w-full max-h-full red-team-logo">
              </div>
              <div class="text-center font-bold text-red-400">
                {{ match.info.teams[1].name }}
              </div>
              <div class="text-sm mt-1" :class="match.info.teams[1].gameOutcome ? 'text-green-500' : 'text-red-500'">
                {{ match.info.teams[1].gameOutcome ? 'VICTORY' : 'DEFEAT' }}
              </div>
            </div>
          </div>
          
          <!-- Match Summary Stats -->
          <div class="flex justify-between mt-4 text-sm border-t border-gray-700 pt-3">
            <div class="text-center">
              <div class="font-bold text-blue-400">{{ match.info.teams[0].kills }}</div>
              <div class="text-xs text-gray-400">Kills</div>
            </div>
            <div class="text-center">
              <div class="font-bold">{{ match.info.gameVersion }}</div>
              <div class="text-xs text-gray-400">Patch</div>
            </div>
            <div class="text-center">
              <div class="font-bold text-red-400">{{ match.info.teams[1].kills }}</div>
              <div class="text-xs text-gray-400">Kills</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="spinner w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <!-- No Matches State -->
    <div v-if="!loading && matches.length === 0" class="text-center py-8">
      <p class="text-gray-400">No matches found.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'MatchView',
  setup() {
    const router = useRouter()
    const matches = ref([])
    const loading = ref(true)
    
    // Format match date
    const formatDate = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit' 
      })
    }
    
    // Format match duration
    const formatDuration = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }
    
    // Get team logo URL based on team name
      const getTeamLogo = (teamName) => {
          // Map team names to logo paths
          const teamLogos = {
              // PNG logos
              'Bandle City Buckaroos': 'Bandle_City_Buckaroos.png',
              'Bilgewater Bullets': '/Bilgewater_Bullets_Logo.png',
              'Demacia Justice': 'Demacian_Justice_Logo.png',
              'Freljord Frost': 'Frejlord_Frost_Logo.png',
              'Noxus Gladiators': 'Noxian_Gladiators_Logo.png',
              'Piltover Progress': 'Piltover_Progress_Logo.png',
              'Shurima Scorch': 'Shuriman_Scorch_Logo.png',
              'Targon Titans': 'Targon_Titans_Logo.png',
              'Zaun Plague': 'Zaun_Plague.png',

              // SVG logos
              'Discord Kittens': 'Discord Kittens Logo.svg',
              'Gets On Base': 'Gets On Base Logo.svg',
              'League of Liquor': 'League of Liquor Logo.svg',
              'M.A.A.': 'M.A.A. Logo.svg',
              'S.G.I.': 'S.G.I. Logo.svg',
              'Team Bell': 'Team Bell Logo.svg',
              'Team Hospitalized': 'Team Hospitalized Logo.svg',

          }
  
          return new URL(`../assets/teams/${teamLogos[teamName]}`, import.meta.url).href
        
      }
      

    
    // Sort matches by date (recent first)
    const sortedMatches = computed(() => {
      return [...matches.value].sort((a, b) => {
        return new Date(b.info.gameCreation) - new Date(a.info.gameCreation)
      })
    })
    
    // Navigate to match detail page
    const navigateToMatch = (matchId) => {
      router.push(`/match/${matchId}`)
    }
    
    // Fetch matches on component mount
    onMounted(async () => {
      try {
        loading.value = true
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/matches`)
        matches.value = response.data|| []
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        loading.value = false
      }
    })
    
    return {
      matches,
      sortedMatches,
      loading,
      formatDate,
      formatDuration,
      getTeamLogo,
      navigateToMatch
    }
  }
}
</script>

<style scoped>
.blue-team-logo {
  filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.5));
}

.red-team-logo {
  filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.5));
}
</style>