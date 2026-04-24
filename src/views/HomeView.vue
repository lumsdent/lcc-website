<template>
  <div class="p-6 max-w-7xl mx-auto">

    <!-- Hero: two-column -->
    <div class="flex flex-col lg:flex-row items-center gap-10 py-10 mb-12">

      <!-- Left: identity + CTAs -->
      <div class="flex-1 min-w-0 text-center lg:text-left">
        <img src="@/assets/logo.svg" alt="LCC logo" class="mx-auto lg:mx-0 mb-5 w-20 h-20 drop-shadow-lg" />
        <h1 class="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
          League <span class="text-logo-blue">Community</span> Cup
        </h1>
        <p class="text-gray-400 text-lg mb-2">Amateur League of Legends &middot; Est. 2022</p>
        <p class="text-gray-500 text-sm mb-8 max-w-md mx-auto lg:mx-0">
          A competitive community tournament where players of all skill levels battle it out each season for the championship.
        </p>

        <!-- Live badge -->
        <div class="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-300 mb-6">
          <span class="w-2 h-2 rounded-full bg-logo-blue animate-pulse"></span>
          <span>Season 4 is <span class="text-logo-blue font-semibold">Live</span> — Thursdays at 7:00 PM EST</span>
        </div>

        <!-- CTAs -->
        <div class="flex flex-wrap gap-3 justify-center lg:justify-start">
          <router-link to="/matches"
            class="px-5 py-2.5 bg-logo-blue hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors text-sm">
            View Matches
          </router-link>
          <a href="https://www.twitch.tv/jagshockey" target="_blank" rel="noopener"
            class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500 text-gray-300 hover:text-purple-400 font-semibold rounded-lg transition-colors text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
            </svg>
            Watch Live
          </a>
          <router-link to="/teams"
            class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold rounded-lg transition-colors text-sm">
            Teams
          </router-link>
        </div>
      </div>

      <!-- Right: video -->
      <div class="w-full lg:w-[55%] shrink-0">
        <div class="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl shadow-logo-blue/10">
          <div class="absolute -inset-1 bg-logo-blue/10 blur-xl rounded-2xl -z-10"></div>
          <div class="relative w-full" style="padding-top: 56.25%;">
            <iframe
              class="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/LA5v7hVka-s?si=dxHVYprdfJK0htrJ"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-700 rounded-xl overflow-hidden border border-gray-700 mb-16">
      <div class="bg-gray-800 px-6 py-5 text-center">
        <div class="text-2xl font-extrabold text-white">4</div>
        <div class="text-xs text-gray-500 uppercase tracking-widest mt-1">Seasons</div>
      </div>
      <div class="bg-gray-800 px-6 py-5 text-center">
        <div class="text-2xl font-extrabold text-white">8</div>
        <div class="text-xs text-gray-500 uppercase tracking-widest mt-1">Teams</div>
      </div>
      <div class="bg-gray-800 px-6 py-5 text-center">
        <div class="text-2xl font-extrabold text-white">75+</div>
        <div class="text-xs text-gray-500 uppercase tracking-widest mt-1">Matches</div>
      </div>
      <div class="bg-gray-800 px-6 py-5 text-center">
        <div class="text-2xl font-extrabold text-white">60+</div>
        <div class="text-xs text-gray-500 uppercase tracking-widest mt-1">Players</div>
      </div>
    </div>

    <!-- Season 4 Standings -->
    <div class="mb-16">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-white">Season 4 Standings</h2>
      </div>

      <!-- Loading -->
      <div v-if="standingsLoading" class="flex justify-center py-10">
        <div class="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="standings.length" class="rounded-xl overflow-hidden border border-gray-700">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-800 border-b border-gray-700 text-gray-400 uppercase tracking-widest text-xs">
              <th class="py-2.5 px-4 text-center w-10">#</th>
              <th class="py-2.5 px-4 text-left">Team</th>
              <th class="py-2.5 px-4 text-center">W</th>
              <th class="py-2.5 px-4 text-center">L</th>
              <th class="py-2.5 px-4 text-center hidden sm:table-cell">W%</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(team, index) in standings"
              :key="team.teamName"
              class="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer transition-colors"
              :class="index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/60'"
              @click="$router.push(`/teams/${resolveTeamId(team.teamName)}`)"
            >
              <td class="py-2.5 px-4 text-center">
                <span
                  class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                  :class="index === 0 ? 'bg-yellow-500/20 text-yellow-400' : index === 1 ? 'bg-gray-500/20 text-gray-300' : index === 2 ? 'bg-orange-700/20 text-orange-400' : 'bg-gray-700/40 text-gray-500'"
                >{{ index + 1 }}</span>
              </td>
              <td class="py-2.5 px-4">
                <div class="flex items-center gap-2.5">
                  <TeamLogo :teamName="team.teamName" season="4" class="w-7 h-7 object-contain flex-shrink-0" />
                  <span class="text-white font-semibold">{{ team.teamName }}</span>
                </div>
              </td>
              <td class="py-2.5 px-4 text-center font-bold text-green-400">{{ team.wins }}</td>
              <td class="py-2.5 px-4 text-center font-bold text-red-400">{{ team.losses }}</td>
              <td class="py-2.5 px-4 text-center hidden sm:table-cell"
                  :class="team.winRate >= 0.6 ? 'text-green-400 font-semibold' : team.winRate <= 0.4 ? 'text-red-400' : 'text-gray-300'"
              >{{ (team.winRate * 100).toFixed(1) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Explore -->
    <div class="mb-16">
      <h2 class="text-xl font-bold text-white mb-6">Explore</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <router-link to="/matches"
          class="group flex items-center gap-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-logo-blue px-5 py-4 transition-all duration-200 hover:shadow-lg">
          <div class="w-9 h-9 rounded-lg bg-logo-blue/10 flex items-center justify-center text-logo-blue shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white group-hover:text-logo-blue transition-colors">Matches</div>
            <div class="text-xs text-gray-500 truncate">Full scoreboards and stats</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600 group-hover:text-logo-blue ml-auto shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>

        <router-link to="/teams"
          class="group flex items-center gap-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-logo-blue px-5 py-4 transition-all duration-200 hover:shadow-lg">
          <div class="w-9 h-9 rounded-lg bg-logo-blue/10 flex items-center justify-center text-logo-blue shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white group-hover:text-logo-blue transition-colors">Teams</div>
            <div class="text-xs text-gray-500 truncate">Rosters, histories, records</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600 group-hover:text-logo-blue ml-auto shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>

        <router-link to="/players"
          class="group flex items-center gap-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-logo-blue px-5 py-4 transition-all duration-200 hover:shadow-lg">
          <div class="w-9 h-9 rounded-lg bg-logo-blue/10 flex items-center justify-center text-logo-blue shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white group-hover:text-logo-blue transition-colors">Players</div>
            <div class="text-xs text-gray-500 truncate">Profiles, roles, team history</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600 group-hover:text-logo-blue ml-auto shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>

        <router-link to="/stats"
          class="group flex items-center gap-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-logo-blue px-5 py-4 transition-all duration-200 hover:shadow-lg">
          <div class="w-9 h-9 rounded-lg bg-logo-blue/10 flex items-center justify-center text-logo-blue shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white group-hover:text-logo-blue transition-colors">Stats</div>
            <div class="text-xs text-gray-500 truncate">KDA, damage, CS, win rates</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600 group-hover:text-logo-blue ml-auto shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>

        <router-link to="/schedule"
          class="group flex items-center gap-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-logo-blue px-5 py-4 transition-all duration-200 hover:shadow-lg">
          <div class="w-9 h-9 rounded-lg bg-logo-blue/10 flex items-center justify-center text-logo-blue shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white group-hover:text-logo-blue transition-colors">Schedule</div>
            <div class="text-xs text-gray-500 truncate">Upcoming match dates</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600 group-hover:text-logo-blue ml-auto shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>

        <a href="https://www.twitch.tv/jagshockey" target="_blank" rel="noopener"
          class="group flex items-center gap-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 px-5 py-4 transition-all duration-200 hover:shadow-lg">
          <div class="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">Watch Live</div>
            <div class="text-xs text-gray-500 truncate">Thursdays 7:00 PM EST on Twitch</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600 group-hover:text-purple-400 ml-auto shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>

      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import teamsDataJson from '@/data/teamsData.json'
import TeamLogo from '@/components/TeamLogo.vue'

export default {
  name: 'HomeView',
  components: { TeamLogo },
  setup() {
    const router = useRouter()
    const standings = ref([])
    const standingsLoading = ref(true)

    const nameMap = {}
    for (const team of teamsDataJson.teams) {
      nameMap[team.name] = team.id
      if (team.formerName) nameMap[team.formerName] = team.id
    }
    const resolveTeamId = (name) => nameMap[name] ?? null

    onMounted(async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/standings/4`)
        standings.value = res.data
      } catch (e) {
        console.error('Failed to load standings:', e)
      } finally {
        standingsLoading.value = false
      }
    })

    return { standings, standingsLoading, resolveTeamId }
  }
}
</script>