<template>
  <div v-if="team" class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <RouterLink to="/teams" class="hover:text-white transition-colors">Teams</RouterLink>
        <span>/</span>
        <span class="text-gray-300">{{ team.name }}</span>
      </nav>

      <!-- Team Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-center mb-2">{{ team.name }}</h1>
        <div class="h-1 w-24 mx-auto" :style="{ backgroundColor: team.primaryColor }"></div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <!-- Left Panel: Bio Card, Roster, and Recent Matches -->
        <div class="lg:col-span-1 flex flex-col gap-8">
          <!-- Bio Card -->
          <div class="rounded-lg p-8 w-full text-white bg-gray-800" :style="{ boxShadow: `0 0 20px 3px ${team.primaryColor}` }">
            <div class="flex justify-center mb-6">
              <TeamLogo
                :imageName="mostRecentImage.name"
                :alt="team.name"
                class="w-40 h-40 object-contain"
              />
            </div>
            
            <div class="space-y-6">
                <!-- Former Name -->
              <div v-if="team.formerName" class="border-b pb-6 text-center" style="border-color: rgba(255,255,255,0.2);">
                <p class="text-base font-semibold text-white" style="color: rgba(255,255,255,0.75);">
                    {{ team.tricode }}
                </p>
                <p class="text-sm italic" style="color: rgba(255,255,255,0.7);">Formerly known as</p>
                <p class="text-base font-semibold text-white">{{ team.formerName }}</p>
              </div>

              <!-- Established -->
              <div class="border-b pb-6" style="border-color: rgba(255,255,255,0.2);">
                <div class="grid grid-cols-3 gap-4">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-white">{{ team.established }}</p>
                    <p class="text-xs mt-1" style="color: rgba(255,255,255,0.7);">ESTABLISHED</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-white">{{ teamMVPs }}</p>
                    <p class="text-xs mt-1" style="color: rgba(255,255,255,0.7);">MVPs</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-white">{{ teamAllPros }}</p>
                    <p class="text-xs mt-1" style="color: rgba(255,255,255,0.7);">ALL-PROs</p>
                  </div>
                </div>
              </div>

              <!-- Stats Section: Win/Loss and Kills/Deaths -->
              <div class="flex flex-row gap-8 justify-center">
                <!-- Win/Loss Record -->
                <div>
                  <h3 class="text-sm font-semibold mb-4 text-center" style="color: rgba(255,255,255,0.7);">TOTAL RECORD</h3>
                  <div class="flex flex-col items-center gap-4">
                    <!-- Pie Chart -->
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <!-- Background circle -->
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
                      <!-- Wins (green) -->
                      <path
                        :d="getPieSlicePath(team.totalWins, team.totalWins + team.totalLosses, 60, 60, 50)"
                        fill="#4ade80"
                        opacity="0.8"
                      />
                      <!-- Losses (red) -->
                      <path
                        :d="getPieSlicePath(team.totalLosses, team.totalWins + team.totalLosses, 60, 60, 50, team.totalWins)"
                        fill="#ef4444"
                        opacity="0.8"
                      />
                    </svg>
                    <!-- Record Text -->
                    <div class="text-center">
                      <div class="flex items-center gap-4 justify-center mb-2">
                        <div class="flex items-center gap-1">
                          <div class="w-3 h-3 rounded-full" style="background-color: #4ade80;"></div>
                          <span class="text-sm font-semibold">{{ team.totalWins }}W</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <div class="w-3 h-3 rounded-full" style="background-color: #ef4444;"></div>
                          <span class="text-sm font-semibold">{{ team.totalLosses }}L</span>
                        </div>
                      </div>
                      <p class="text-lg font-bold text-white">{{ winRate }}% Win Rate</p>
                    </div>
                  </div>
                </div>

                <!-- Kills/Deaths Stats -->
                <div>
                  <h3 class="text-sm font-semibold mb-4 text-center" style="color: rgba(255,255,255,0.7);">COMBAT STATS</h3>
                  <div class="flex flex-col items-center gap-4">
                    <!-- Pie Chart -->
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <!-- Background circle -->
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
                      <!-- Kills (blue) -->
                      <path
                        :d="getPieSlicePath(totalKills, totalKills + totalDeaths, 60, 60, 50)"
                        fill="#60a5fa"
                        opacity="0.8"
                      />
                      <!-- Deaths (orange) -->
                      <path
                        :d="getPieSlicePath(totalDeaths, totalKills + totalDeaths, 60, 60, 50, totalKills)"
                        fill="#f97316"
                        opacity="0.8"
                      />
                    </svg>
                    <!-- Stats Text -->
                    <div class="text-center">
                      <div class="flex items-center gap-4 justify-center mb-2">
                        <div class="flex items-center gap-1">
                          <div class="w-3 h-3 rounded-full" style="background-color: #60a5fa;"></div>
                          <span class="text-sm font-semibold">{{ totalKills }} Kills</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <div class="w-3 h-3 rounded-full" style="background-color: #f97316;"></div>
                          <span class="text-sm font-semibold">{{ totalDeaths }} Deaths</span>
                        </div>
                      </div>
                      <p class="text-lg font-bold text-white" v-if="totalKills + totalDeaths > 0">{{ (totalKills / (totalKills + totalDeaths) * 100).toFixed(1) }}% KD-Ratio</p>
                      <p class="text-lg font-bold text-white" v-else>No Data</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Inner Grid: Roster and Recent Matches -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <!-- Roster Card -->
            <div class="rounded-lg p-4 w-full text-white bg-gray-800" :style="{ boxShadow: `0 0 20px 3px ${team.primaryColor}` }">
              <!-- <h3 class="text-sm font-semibold mb-3 text-white">Roster</h3> -->
              
              <!-- Season Tabs -->
              <div class="flex gap-1 mb-4 border-b text-xs" style="border-color: rgba(255,255,255,0.2);">
                <button
                  v-for="season in sortedSeasons"
                  :key="season.season"
                  @click="selectedSeasonForRoster = season.season"
                  :class="{
                    'text-white': selectedSeasonForRoster === season.season,
                    'text-gray-300': selectedSeasonForRoster !== season.season
                  }"
                  :style="{
                    borderBottomColor: selectedSeasonForRoster === season.season ? 'white' : 'transparent',
                    borderBottomWidth: selectedSeasonForRoster === season.season ? '2px' : '0'
                  }"
                  class="px-2 py-1 font-semibold text-xs hover:text-white transition"
                >
                  S{{ season.season }}
                </button>
              </div>

              <!-- Current Season Roster Display -->
              <div v-if="currentSeasonRoster && currentSeasonRoster.roster">
                <!-- Top Lane -->
                <div class="mb-2">
                  <div class="border border-gray-300 rounded p-2 text-xs">
                    <div v-for="player in getPlayersByRole(currentSeasonRoster.roster, 'TOP')" :key="`${currentSeasonRoster.season}-${player.role}`">
                      <span class="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded mr-2">{{ player.role }}</span>
                      <span class="font-medium">{{ player.name }}</span>
                    </div>
                  </div>
                </div>

                <!-- Mid Row: Jungle, Mid -->
                <div class="grid grid-cols-2 gap-2 mb-2 text-xs">
                  <div class="border border-gray-300 rounded p-2">
                    <div v-for="player in getPlayersByRole(currentSeasonRoster.roster, 'JUNGLE')" :key="`${currentSeasonRoster.season}-${player.role}`">
                      <span class="inline-block bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded mr-2">{{ player.role }}</span>
                      <span class="font-medium">{{ player.name }}</span>
                    </div>
                  </div>
                  <div class="border border-gray-300 rounded p-2">
                    <div v-for="player in getPlayersByRole(currentSeasonRoster.roster, 'MID')" :key="`${currentSeasonRoster.season}-${player.role}`">
                      <span class="inline-block bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded mr-2">{{ player.role }}</span>
                      <span class="font-medium">{{ player.name }}</span>
                    </div>
                  </div>
                </div>

                <!-- Bottom Row: Bot, Support -->
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="border border-gray-300 rounded p-2">
                    <div v-for="player in getPlayersByRole(currentSeasonRoster.roster, 'BOT')" :key="`${currentSeasonRoster.season}-${player.role}`">
                      <span class="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded mr-2">{{ player.role }}</span>
                      <span class="font-medium">{{ player.name }}</span>
                    </div>
                  </div>
                  <div class="border border-gray-300 rounded p-2">
                    <div v-for="player in getPlayersByRole(currentSeasonRoster.roster, 'SUPPORT')" :key="`${currentSeasonRoster.season}-${player.role}`">
                      <span class="inline-block bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded mr-2">{{ player.role }}</span>
                      <span class="font-medium">{{ player.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- No Roster Message -->
              <div v-else-if="currentSeasonRoster && !currentSeasonRoster.roster" class="text-center py-8 text-gray-400 text-sm">
                No roster data available for Season {{ selectedSeasonForRoster }}
              </div>
            </div>

            <!-- Recent Matches Carousel -->
            <div v-if="recentMatches.length > 0" class="relative rounded-lg bg-gray-800" :style="{ boxShadow: `0 0 20px 3px ${team.primaryColor}` }">
              <!-- Carousel Container -->
              <div class="flex items-center justify-center h-full">
                <!-- Previous Button -->
                <button 
                  v-if="recentMatches.length > 1"
                  @click="previousMatch" 
                  class="absolute -left-5 z-10 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 transition-colors"
                  :style="{ top: '50%', transform: 'translateY(-50%)' }">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <!-- Match Card Container -->
                <div class="w-full">
                  <div v-if="recentMatches.length > 0"
                       :key="currentMatchIndex"
                       class="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow p-3"
                       @click="navigateToMatch(recentMatches[currentMatchIndex].metadata.matchId)">
                    
                    <!-- Match Card Content -->
                    <!-- Date and Time -->
                    <div class="text-gray-400 text-xs mb-2">
                      {{ formatDate(recentMatches[currentMatchIndex].info.gameCreation) }}
                    </div>
                    
                    <!-- Teams Display -->
                    <div class="flex items-center justify-between">
                      <!-- Blue Team -->
                      <div class="flex flex-col items-center flex-1">
                        <div class="w-12 h-12 mb-1 flex items-center justify-center">
                          <TeamLogo
                            :teamName="recentMatches[currentMatchIndex].info.teams[0].name"
                            class="max-w-full max-h-full"
                          />
                        </div>
                        <div class="text-center font-bold text-blue-400 text-xs">
                          {{ recentMatches[currentMatchIndex].info.teams[0].name }}
                        </div>
                        <div class="text-xs mt-1" :class="recentMatches[currentMatchIndex].info.teams[0].gameOutcome ? 'text-green-500' : 'text-red-500'">
                          {{ recentMatches[currentMatchIndex].info.teams[0].gameOutcome ? 'W' : 'L' }}
                        </div>
                      </div>
                      
                      <!-- VS Icon -->
                      <div class="flex flex-col items-center px-2">
                        <div class="text-sm font-bold text-gray-300">VS</div>
                        <div class="text-xs text-gray-400">
                          {{ formatDuration(recentMatches[currentMatchIndex].info.gameDuration) }}
                        </div>
                      </div>
                      
                      <!-- Red Team -->
                      <div class="flex flex-col items-center flex-1">
                        <div class="w-12 h-12 mb-1 flex items-center justify-center">
                          <TeamLogo
                            :teamName="recentMatches[currentMatchIndex].info.teams[1].name"
                            class="max-w-full max-h-full"
                          />
                        </div>
                        <div class="text-center font-bold text-red-400 text-xs">
                          {{ recentMatches[currentMatchIndex].info.teams[1].name }}
                        </div>
                        <div class="text-xs mt-1" :class="recentMatches[currentMatchIndex].info.teams[1].gameOutcome ? 'text-green-500' : 'text-red-500'">
                          {{ recentMatches[currentMatchIndex].info.teams[1].gameOutcome ? 'W' : 'L' }}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Match Summary Stats -->
                    <div class="flex justify-between mt-4 text-xs border-t border-gray-700 pt-3">
                      <div class="text-center">
                        <div class="font-bold text-blue-400">{{ recentMatches[currentMatchIndex].info.teams[0].kills }}</div>
                        <div class="text-gray-400">Kills</div>
                      </div>
                      <div class="text-center">
                        <div class="font-bold text-gray-300">{{ recentMatches[currentMatchIndex].info.gameVersion }}</div>
                        <div class="text-gray-400">Patch</div>
                      </div>
                      <div class="text-center">
                        <div class="font-bold text-red-400">{{ recentMatches[currentMatchIndex].info.teams[1].kills }}</div>
                        <div class="text-gray-400">Kills</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Next Button -->
                <button 
                  v-if="recentMatches.length > 1"
                  @click="nextMatch" 
                  class="absolute -right-5 z-10 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 transition-colors"
                  :style="{ top: '50%', transform: 'translateY(-50%)' }">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <!-- Carousel Indicators -->
              <div v-if="recentMatches.length > 1" class="flex justify-center gap-2 mt-3">
                <button
                  v-for="(_, index) in recentMatches"
                  :key="index"
                  @click="currentMatchIndex = index"
                  :class="[
                    'rounded-full transition-all',
                    currentMatchIndex === index ? 'bg-white w-6 h-2' : 'bg-gray-400 w-2 h-2'
                  ]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Season History -->
        <div class="lg:col-span-2">
          <div class="rounded-lg p-8 text-white bg-gray-800" :style="{ boxShadow: `0 0 20px 3px ${team.primaryColor}` }">
            <h2 class="text-2xl font-bold mb-6 text-white">Team History</h2>
            
            <div v-for="season in sortedSeasons" :key="season.season" class="mb-12 last:mb-0 pl-6" :style="{ borderLeft: `4px solid ${team.primaryColor}` }">
                <!-- Season Header -->
                <div class="mb-6">
                    <div class="flex items-center gap-4 mb-3">
                        <h3 class="text-2xl font-bold text-white">Season {{ season.season }}</h3>
                        <div v-if="season.wins !== undefined || season.losses !== undefined" class="flex items-baseline gap-1 px-3 py-1 rounded" style="background-color: rgba(255,255,255,0.1);">
                            <span class="text-green-300 font-bold">{{ season.wins || 0 }}W</span>
                            <span style="color: rgba(255,255,255,0.7);">-</span>
                            <span class="text-red-300 font-bold">{{ season.losses || 0 }}L</span>
                        </div>
                        <div v-if="season.placement" class="text-sm font-semibold" style="color: rgba(255,255,255,0.7);">
                            {{ season.placement }}<sup>{{ getOrdinalSuffix(season.placement) }}</sup> Place
                        </div>
                    </div>
                </div>

                <!-- Season Description -->
                <p v-if="season.history" class="leading-relaxed text-base text-white">
                  {{ season.history }}
                </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Gallery Section -->
      <div class="mt-12">
        <div class="rounded-lg p-8 text-white bg-gray-800" :style="{ boxShadow: `0 0 20px 3px ${team.primaryColor}` }">
          <h2 class="text-2xl font-bold mb-8 text-center text-white">Gallery (Historical)</h2>
          <div class="flex flex-wrap gap-8 justify-center">
            <div
              v-for="(image, index) in team.images"
              :key="index"
              class="rounded-lg flex flex-col items-center justify-center min-h-48"
            >
              <TeamLogo
                :imageName="image.name"
                :alt="`Team logo from ${image.date}`"
                class="w-32 h-32 object-contain mb-4"
              />
              <div class="text-center">
                <p class="text-sm font-semibold text-white">{{ image.date }}</p>
                <p
                  class="text-xs text-green-400 min-h-4"
                  :class="mostRecentImage.date === image.date ? 'opacity-100' : 'opacity-0'"
                >
                  Current
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="text-xl">Team not found</p>
  </div>
</template>

<script>
import teamsData from '../data/teamsData.json';
import axios from 'axios';
import TeamLogo from '@/components/TeamLogo.vue'

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default {
  name: 'TeamDetailView',
  components: { TeamLogo },
  props: {
    teamId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      team: null,
      selectedSeasonForRoster: null,
      matches: [],
      currentMatchIndex: 0,
      apiTeamData: null
    };
  },
  computed: {
    sortedSeasons() {
      if (!this.team || !this.team.seasons) return [];
      return [...this.team.seasons].sort((a, b) => a.season - b.season);
    },
    currentSeasonRoster() {
      if (!this.team || !this.team.seasons) return null;
      return this.team.seasons.find(s => Number(s.season) === Number(this.selectedSeasonForRoster));
    },
    recentMatches() {
      if (!this.team || this.matches.length === 0) return [];
      
      // Filter matches for this team
      const teamMatches = this.matches.filter(match => {
        const teamNames = match.info.teams.map(t => t.name);
        return teamNames.includes(this.team.name);
      });
      
      // Sort by game creation time (newest first) and get last 5
      return teamMatches
        .sort((a, b) => new Date(b.info.gameCreation) - new Date(a.info.gameCreation))
        .slice(0, 5);
    },
    winRate() {
      if (!this.team || this.team.totalWins + this.team.totalLosses === 0) return 0;
      return Math.round((this.team.totalWins / (this.team.totalWins + this.team.totalLosses)) * 100);
    },
    totalKills() {
      if (!this.matches) return 0;
      let kills = 0;
      this.matches.forEach(match => {
        const teamData = match.info.teams.find(t => t.name === this.team.name);
        if (teamData) {
          kills += teamData.kills || 0;
        }
      });
      return kills;
    },
    totalDeaths() {
      if (!this.matches) return 0;
      let deaths = 0;
      this.matches.forEach(match => {
        const teamData = match.info.teams.find(t => t.name === this.team.name);
        if (teamData && teamData.players) {
          teamData.players.forEach(player => {
            deaths += player.deaths || 0;
          });
        }
      });
      return deaths;
    },
    teamMVPs() {
      return this.team?.mvps ?? 0;
    },
    teamAllPros() {
      return this.team?.allPros ?? 0;
    },
    mostRecentImage() {
      if (!this.team || !this.team.images || this.team.images.length === 0) return null;
      return this.team.images.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
      });
    }
  },
  methods: {
    getPieSlicePath(value, total, centerX, centerY, radius, firstSliceValue = 0) {
      // Handle edge cases
      if (!total || total === 0 || value === 0) return '';
      if (value === total) {
        // Draw a full circle for 100%
        return `M ${centerX} ${centerY} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
      }
      
      const percentage = value / total;
      const angle = percentage * 2 * Math.PI;
      const startAngle = (firstSliceValue / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      
      const startX = centerX + radius * Math.sin(startAngle);
      const startY = centerY - radius * Math.cos(startAngle);
      const endX = centerX + radius * Math.sin(endAngle);
      const endY = centerY - radius * Math.cos(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;
      
      return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
    },
    getOrdinalSuffix(num) {
      const j = num % 10;
      const k = num % 100;
      if (j === 1 && k !== 11) {
        return 'st';
      }
      if (j === 2 && k !== 12) {
        return 'nd';
      }
      if (j === 3 && k !== 13) {
        return 'rd';
      }
      return 'th';
    },
    getPlayersByRole(players, role) {
      if (!players || !Array.isArray(players)) return [];
      return players.filter(p => p.role === role);
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatDuration(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}m ${seconds}s`;
    },
    navigateToMatch(matchId) {
      this.$router.push({
        name: 'matchDetail',
        params: { matchId },
        query: { from: 'team', teamId: this.team.id, teamName: this.team.name }
      });
    },
    async fetchMatches() {
      try {
        const response = await axios.get(`${VITE_API_URL}/matches`);
        this.matches = response.data;
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    },
    async fetchTeamRecords() {
      if (!this.team) return;
      
      try {
        // Build query string with team name and former name
        const teamNames = [this.team.name];
        if (this.team.formerName) {
          teamNames.push(this.team.formerName);
        }
        
        const response = await axios.get(`${VITE_API_URL}/teams/records`, {
          params: {
            team_ids: teamNames.join(',')
          }
        });
        
        // Get the first team record from the response
        if (response.data && response.data.length > 0) {
          this.apiTeamData = response.data[0];
          
          // Merge API data with static team data
          if (this.apiTeamData) {
            this.team.totalWins = this.apiTeamData.totalWins || 0;
            this.team.totalLosses = this.apiTeamData.totalLosses || 0;
            this.team.totalKills = this.apiTeamData.totalKills || 0;
            this.team.totalAssists = this.apiTeamData.totalAssists || 0;
            this.team.totalDeaths = this.apiTeamData.totalDeaths || 0;
            
            // Preserve all static seasons and merge with API data
            const staticSeasons = this.team.seasons || [];
            const staticSeasonsByNumber = new Map(
              staticSeasons.map(season => [Number(season.season), season])
            );
            
            // Merge season stats with static writeups
            if (this.apiTeamData.seasons) {
              // Add or update seasons from API
              this.apiTeamData.seasons.forEach(apiSeason => {
                const seasonNumber = Number(apiSeason.season);
                const staticSeason = staticSeasonsByNumber.get(seasonNumber);
                if (staticSeason) {
                  // Merge API data with existing static season by creating new object
                  const mergedSeason = { ...staticSeason, ...apiSeason };
                  staticSeasonsByNumber.set(seasonNumber, mergedSeason);
                } else {
                  // Add new season from API
                  staticSeasonsByNumber.set(seasonNumber, { ...apiSeason });
                }
              });
            } else if (this.apiTeamData.rosters) {
              // Handle rosters object format from API
              Object.keys(this.apiTeamData.rosters).forEach(seasonKey => {
                const seasonNumber = Number(seasonKey);
                const staticSeason = staticSeasonsByNumber.get(seasonNumber);
                const players = this.apiTeamData.rosters[seasonKey];
                
                if (staticSeason) {
                  // Merge roster data with existing static season by creating a new object
                  const mergedSeason = { ...staticSeason, players };
                  staticSeasonsByNumber.set(seasonNumber, mergedSeason);
                } else {
                  // Add new season from API
                  staticSeasonsByNumber.set(seasonNumber, { season: seasonNumber, players });
                }
              });
            }
            
            // Convert map back to array and sort
            this.team.seasons = Array.from(staticSeasonsByNumber.values())
              .sort((a, b) => a.season - b.season);
            
            // Debug log
            console.log('Updated team.seasons:', this.team.seasons);
            
            // Update selected season for roster to the most recent season with players
            const seasonsWithPlayers = this.team.seasons.filter(s => s.roster && s.roster.length > 0);
            console.log('Seasons with players:', seasonsWithPlayers);
            if (seasonsWithPlayers.length > 0) {
              this.selectedSeasonForRoster = Math.max(...seasonsWithPlayers.map(s => s.season));
              console.log('Selected season for roster:', this.selectedSeasonForRoster);
            } else if (this.team.seasons.length > 0) {
              // Fallback to most recent season even without players
              this.selectedSeasonForRoster = Math.max(...this.team.seasons.map(s => s.season));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching team records:', error);
      }
    },
    nextMatch() {
      if (this.recentMatches.length > 1) {
        this.currentMatchIndex = (this.currentMatchIndex + 1) % this.recentMatches.length;
      }
    },
    previousMatch() {
      if (this.recentMatches.length > 1) {
        this.currentMatchIndex = (this.currentMatchIndex - 1 + this.recentMatches.length) % this.recentMatches.length;
      }
    }
  },
  mounted() {
    // Scroll to top of page
    window.scrollTo(0, 0);
    
    const foundTeam = teamsData.teams.find(t => t.id === this.teamId);
    if (foundTeam) {
      this.team = foundTeam;
      // Set the selected season to the most recent season
      if (this.team.seasons && this.team.seasons.length > 0) {
        this.selectedSeasonForRoster = Math.max(...this.team.seasons.map(s => s.season));
      }
    } else {
      // Fallback: if ID not found, try to find by name
      const teamByName = teamsData.teams.find(
        t => t.name.toLowerCase().replace(/\s+/g, '-') === this.teamId
      );
      this.team = teamByName || null;
      if (this.team && this.team.seasons && this.team.seasons.length > 0) {
        this.selectedSeasonForRoster = Math.max(...this.team.seasons.map(s => s.season));
      }
    }
    
    // Fetch matches and team records when component mounts
    this.fetchMatches();
    this.fetchTeamRecords();
  }
};
</script>

<style scoped>
/* Add any team-specific styles here */
</style>
