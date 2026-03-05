<template>
<div class="p-6">
    <!-- BREADCRUMB -->
    <nav class="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <template v-if="fromPlayer">
            <RouterLink to="/players" class="hover:text-white transition-colors">Players</RouterLink>
            <span>/</span>
            <RouterLink :to="`/players/${fromPuuid}`" class="hover:text-white transition-colors">{{ fromPlayerName }}</RouterLink>
        </template>
        <template v-else-if="fromTeam">
            <RouterLink to="/teams" class="hover:text-white transition-colors">Teams</RouterLink>
            <span>/</span>
            <RouterLink :to="`/teams/${fromTeamId}`" class="hover:text-white transition-colors">{{ fromTeamName }}</RouterLink>
        </template>
        <template v-else>
            <RouterLink to="/matches" class="hover:text-white transition-colors">Matches</RouterLink>
        </template>
        <span>/</span>
        <span class="text-gray-300">{{ matchId }}</span>
    </nav>

    <div class="mb-6 text-center">
        <h1 class="text-3xl font-bold text-white mb-1">Match Details</h1>
    </div>
    <div v-if="match">
        <!-- Match VS Banner -->
        <div class="flex items-center justify-between mb-6 gap-4">
            <div v-for="(team, i) in match.info.teams" :key="'banner-'+i"
                class="flex flex-col items-center flex-1 min-w-0"
                :class="i === 1 ? 'order-last' : ''">
                <img :src="getTeamLogo(team.name)" class="w-20 h-20 object-contain mb-2 rounded-xl" :alt="team.name" />
                <span class="hidden sm:block text-base font-bold text-white text-center truncate w-full px-1">{{ team.name }}</span>
                <span class="sm:hidden text-base font-bold text-white text-center">{{ getTeamTricode(team.name) }}</span>
                <span class="text-sm font-bold mt-0.5" :class="team.gameOutcome ? 'text-green-400' : 'text-red-400'">{{ team.gameOutcome ? 'VICTORY' : 'DEFEAT' }}</span>
                <span class="text-gray-400 text-sm">{{ team.score }}</span>
            </div>
            <!-- VS + Duration -->
            <div class="flex flex-col items-center shrink-0 gap-2">
                <span class="text-3xl font-extrabold text-gray-300 tracking-widest">VS</span>
                <div class="flex items-center gap-1.5 bg-gray-800 rounded-full px-3 py-1.5 border border-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/>
                    </svg>
                    <span class="text-sm font-mono font-semibold text-gray-200">{{ match.info.gameDuration }}</span>
                </div>
            </div>
        </div>
        <div class="flex flex-col xl:flex-row gap-4">
            <div v-for="(team, i) in match.info.teams" v-bind:key="i" class="flex-1 min-w-0">
                <div class="flex justify-around" :class="i % 2 === 0 ? 'reverse-table' : ''">
                    <div class="flex space-x-3" :class="i % 2 === 0 ? 'xl:flex-row-reverse' : 'xl:flex-row'">
                        <svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
                            version="1.1" fill="none" stroke="#c5b358" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="1.5">
                            <path d="m2.75 9.25 1.5 2.5 2 1.5m-4.5 0 1 1m1.5-2.5-1.5 1.5m3-1 8.5-8.5v-2h-2l-8.5 8.5" />
                            <path
                                d="m10.25 12.25-2.25-2.25m2-2 2.25 2.25m1-1-1.5 2.5-2 1.5m4.5 0-1 1m-1.5-2.5 1.5 1.5m-7.25-5.25-4.25-4.25v-2h2l4.25 4.25" />
                        </svg>
                        <span class="text-lg font-semibold">{{ team.kills }}</span>
                    </div>
                    <div class="flex space-x-3" :class="i % 2 === 0 ? 'xl:flex-row-reverse' : 'xl:flex-row'">
                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13 5C13 6.10457 10.5376 7 7.5 7C4.46243 7 2 6.10457 2 5M13 5C13 3.89543 10.5376 3 7.5 3C4.46243 3 2 3.89543 2 5M13 5V9.45715C11.7785 9.82398 11 10.3789 11 11M2 5V17C2 18.1046 4.46243 19 7.5 19C8.82963 19 10.0491 18.8284 11 18.5429V11M2 9C2 10.1046 4.46243 11 7.5 11C8.82963 11 10.0491 10.8284 11 10.5429M2 13C2 14.1046 4.46243 15 7.5 15C8.82963 15 10.0491 14.8284 11 14.5429M22 11C22 12.1046 19.5376 13 16.5 13C13.4624 13 11 12.1046 11 11M22 11C22 9.89543 19.5376 9 16.5 9C13.4624 9 11 9.89543 11 11M22 11V19C22 20.1046 19.5376 21 16.5 21C13.4624 21 11 20.1046 11 19V11M22 15C22 16.1046 19.5376 17 16.5 17C13.4624 17 11 16.1046 11 15"
                                stroke="#c5b358" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span class="text-lg font-semibold">{{ parseFloat((team.gold / 1000).toFixed(1)) }}K</span>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <div :class="i % 2 === 0 ? 'reverse-table' : ''">
                        <table class="w-full table-fixed text-sm min-w-[580px] [&_td]:border-gray-700 [&_th]:border-gray-700">
                            <colgroup>
                                <col class="w-[9%]">
                                <col class="w-[13%]">
                                <col class="w-[5%]">
                                <col class="w-[5%]">
                                <col class="w-[17%]">
                                <col class="w-[9%]">
                                <col class="w-[10%]">
                                <col class="w-[8%]">
                                <col class="w-[9%]">
                                <col class="w-[15%]">
                            </colgroup>
                            <thead class="bg-gray-900/60">
                                <tr>
                                    <th class="py-1.5 px-1 border-b text-gray-400 text-xs font-medium uppercase truncate">Champ</th>
                                    <th class="py-1.5 px-1 border-b text-gray-400 text-xs font-medium uppercase truncate">Player</th>
                                    <th class="py-1.5 px-1 border-b text-gray-400 text-xs font-medium uppercase truncate">Spells</th>
                                    <th class="py-1.5 px-1 border-b text-gray-400 text-xs font-medium uppercase truncate">Runes</th>
                                    <th class="py-1.5 px-1 border-b text-gray-400 text-xs font-medium uppercase truncate"><span>KDA</span><span class="text-logo-red"> (KP%)</span></th>
                                    <th class="py-1.5 px-1 border-b text-gray-400 text-xs font-medium uppercase truncate">Gold</th>
                                    <th class="py-1.5 px-1 border-b text-gray-400 text-xs font-medium uppercase truncate"><span>CS</span><span class="text-logo-red"> (@14)</span></th>
                                    <th class="py-1.5 px-1 border-b text-gray-400 text-xs font-medium uppercase truncate">Vision</th>
                                    <th class="py-1.5 px-1 border-b text-gray-400 text-xs font-medium uppercase truncate">Dmg</th>
                                    <th class="py-1.5 px-1 border-b text-gray-400 text-xs font-medium uppercase truncate">Build</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- TODO: Highlight highest stat values -->
                                <tr class="text-center align-middle hover:bg-white/5 transition-colors" v-for="player in team.players" v-bind:key="player">
                                    <td class="py-1.5 px-1 border-b">
                                        <div class="flex justify-center items-center">
                                            <ChampionIcon :champion="player.champion" />
                                        </div>
                                    </td>
                                    <td class="py-1.5 px-1 border-b">
                                        <div>
                                            <span class="leading-tight truncate block max-w-full overflow-hidden" :title="player.profile.name">{{ player.profile.name }}</span><br />
                                            <div class="flex justify-center">

                                                <div v-if="player.mvp === true" title="MVP">
                                                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="12" cy="9" r="7" stroke="#20a4f3"
                                                            stroke-width="1.5" />
                                                        <path
                                                            d="M7.35111 15L6.71424 17.323C6.0859 19.6148 5.77173 20.7607 6.19097 21.3881C6.3379 21.6079 6.535 21.7844 6.76372 21.9008C7.41635 22.2331 8.42401 21.7081 10.4393 20.658C11.1099 20.3086 11.4452 20.1339 11.8014 20.0959C11.9335 20.0818 12.0665 20.0818 12.1986 20.0959C12.5548 20.1339 12.8901 20.3086 13.5607 20.658C15.576 21.7081 16.5837 22.2331 17.2363 21.9008C17.465 21.7844 17.6621 21.6079 17.809 21.3881C18.2283 20.7607 17.9141 19.6148 17.2858 17.323L16.6489 15"
                                                            stroke="#20a4f3" stroke-width="1.5"
                                                            stroke-linecap="round" />
                                                    </svg>
                                                </div>
                                                <div v-else class="h-6"></div>
                                                <div v-if="player.firstBlood === true" title="First Blood">
                                                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="12" cy="9" r="7" stroke="#ff3366"
                                                            stroke-width="1.5" />
                                                        <path
                                                            d="M7.35111 15L6.71424 17.323C6.0859 19.6148 5.77173 20.7607 6.19097 21.3881C6.3379 21.6079 6.535 21.7844 6.76372 21.9008C7.41635 22.2331 8.42401 21.7081 10.4393 20.658C11.1099 20.3086 11.4452 20.1339 11.8014 20.0959C11.9335 20.0818 12.0665 20.0818 12.1986 20.0959C12.5548 20.1339 12.8901 20.3086 13.5607 20.658C15.576 21.7081 16.5837 22.2331 17.2363 21.9008C17.465 21.7844 17.6621 21.6079 17.809 21.3881C18.2283 20.7607 17.9141 19.6148 17.2858 17.323L16.6489 15"
                                                            stroke="#ff3366" stroke-width="1.5"
                                                            stroke-linecap="round" />
                                                    </svg>
                                                </div>
                                                <div v-else class="h-6"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-1.5 px-1 border-b">
                                        <span v-if="player.summonerSpells" class="flex flex-col items-center gap-1">
                                            <img class="w-7 h-7" v-for="spell in player.summonerSpells" v-bind:key="spell.name"
                                                :src="`${DDRAGON_URL}${spell.image}`" :title="spell.name">
                                        </span>
                                    </td>
                                    <td class="py-1.5 px-1 border-b">
                                        <div class="flex justify-center items-center">
                                            <span v-if="player.runes" class="flex w-8 h-8 relative">
                                                <img :src="player.runes.primary.keystone.image" :title="player.runes.primary.keystone.name">
                                                <div
                                                    class="bg-gray-800 bg-opacity-50 flex items-center justify-center rounded-full absolute -bottom-1.5 -right-1.5">
                                                    <img :src="player.runes.secondary.image" class="w-4 h-4" :title="player.runes.secondary.name">
                                                </div>
                                            </span>
                                        </div>
                                    </td>
                                    <td class="py-1.5 px-1 border-b">
                                        <span>{{ player.kills }}/{{ player.deaths }}/{{ player.assists }}</span>
                                        <span class="text-logo-red"> ({{ player.killParticipation }}%)</span><br />
                                        <span class="text-xs text-logo-blue">{{ player.kda }} KDA</span>
                                    </td>
                                    <td class="py-1.5 px-1 border-b">
                                        <span>{{ player.goldEarned }}</span><br />
                                        <span class="text-xs text-logo-blue">{{ Math.round(player.gpm) }} GPM</span>
                                    </td>
                                    <td class="py-1.5 px-1 border-b">
                                        <span>{{ player.cs }}</span><span class="text-logo-red"> ({{ player.cs14 }})</span><br />
                                        <span class="text-xs text-logo-blue">{{ player.csm }} CSM</span>
                                    </td>
                                    <td class="py-1.5 px-1 border-b">
                                        <span>{{ player.visionScore }}</span><br />
                                        <span class="text-xs text-logo-blue">{{ Math.round(player.vspm) }} VsPM</span>
                                    </td>
                                    <td class="py-1.5 px-1 border-b">
                                        <span>{{ player.dmg }}</span><br />
                                        <span class="text-xs text-logo-blue">{{ Math.round(player.dpm) }} DPM</span>
                                    </td>
                                    <td class="py-1.5 px-1 border-b">
                                        <div v-if="player.build" class="grid grid-cols-3 gap-px w-full max-w-[72px] mx-auto">
                                            <img class="w-full aspect-square object-cover" v-for="item in player.build" v-bind:key="item.name"
                                                :src="getItemImageUrl(item.image)" :title="item.name">
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="flex justify-center bg-gray-800 rounded-lg border border-gray-700 p-4 mt-3 gap-8">
                    <div class="flex flex-col items-center">
                        <h3 class="text-sm font-semibold text-gray-400 uppercase mb-2">Objectives</h3>
                        <div class="flex gap-2">
                            <div class="flex">
                                <img :src="team.objectives.baron.image" class="w-5 h-5"
                                    :class="team.side === 'Blue' ? 'blue-filter' : 'red-filter'" />
                                <span class="px-1">{{ team.objectives.baron.kills }}</span>
                            </div>
                            <div class="flex">
                                <img :src="team.objectives.dragon.image" class="w-5 h-5"
                                    :class="team.side === 'Blue' ? 'blue-filter' : 'red-filter'" />
                                <span class="px-1">{{ team.objectives.dragon.kills }}</span>
                            </div>
                            <div class="flex">
                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M7.99998 1L6.33333 2.42045C6.33333 2.42045 5.46216 3.2176 5.18153 3.2176H3.92809C3.00001 3.2176 1.66668 4.196 1.37128 5.89721C1.29668 6.32667 1.27273 7.18045 1.93119 8.06625L1 8.81245C1 8.81245 2.33331 9.52267 2.66665 10.9431C2.99998 12.3636 5.08806 13.7042 6.90051 14.0875L7.98099 14.969V15L7.99998 14.9845L8.01896 15V14.969L9.09944 14.0875C10.9119 13.7042 13 12.3636 13.3333 10.9431C13.6666 9.52267 15 8.81245 15 8.81245L14.0688 8.06625C14.7272 7.18045 14.7056 6.34035 14.6287 5.89721C14.3333 4.196 13 3.2176 12.0719 3.2176H10.8184C10.5378 3.2176 9.66667 2.42045 9.66667 2.42045L7.99998 1ZM8.1486 4.2451C8.06916 4.15686 7.93078 4.15686 7.85134 4.2451L5.43358 6.93049C5.35687 7.0157 5.36687 7.14765 5.45522 7.22073C5.72968 7.44776 6.27298 7.90668 6.46151 8.13439C6.67259 8.38935 5.14596 9.53934 4.59964 9.93794C4.50018 10.0105 4.48826 10.1542 4.57436 10.2422L6.41356 12.1222C6.49201 12.2024 6.62105 12.2024 6.69949 12.1222L7.857 10.9391C7.93545 10.8589 8.06449 10.8589 8.14293 10.9391L9.30045 12.1222C9.37889 12.2024 9.50793 12.2024 9.58637 12.1222L11.4256 10.2422C11.5117 10.1542 11.4998 10.0105 11.4003 9.93794C10.854 9.53934 9.32734 8.38935 9.53843 8.13439C9.72695 7.90668 10.2703 7.44776 10.5447 7.22073C10.6331 7.14765 10.6431 7.0157 10.5664 6.93049L8.1486 4.2451Z"
                                        :fill="team.side === 'Blue' ? '#2769ad' : '#961545'"></path>
                                </svg>
                                <span class=" px-1">{{ team.objectives.horde.kills }}</span>
                            </div>
                            <div class="flex">
                                <img :src="team.objectives.riftHerald.image" class="w-5 h-5"
                                    :class="team.side === 'Blue' ? 'blue-filter' : 'red-filter'" />
                                <span class="px-1">{{ team.objectives.riftHerald.kills }}</span>
                            </div>
                            <div class="flex">
                                <img :src="team.objectives.tower.image" class="w-5 h-5"
                                    :class="team.side === 'Blue' ? 'blue-filter' : 'red-filter'" />
                                <span class="px-1">{{ team.objectives.tower.kills }}</span>
                            </div>
                            <div class="flex">
                                <img :src="team.objectives.inhibitor.image" class="w-5 h-5"
                                    :class="team.side === 'Blue' ? 'blue-filter' : 'red-filter'" />
                                <span class="px-1">{{ team.objectives.inhibitor.kills }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center items-center">
                        <h3 class="text-sm font-semibold text-gray-400 uppercase mb-2">Bans</h3>
                        <div class="flex justify-center items-center">
                            <img v-for="ban in team.bans" :key="ban.pickTurn" :src="`${DDRAGON_URL}${ban.image.square}`"
                                class="w-10 h-10 rounded-full m-1 grayscale">
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="flex flex-wrap justify-center gap-6 py-4 border-t border-gray-700 mt-4">
            <p class="text-gray-400 text-sm">Game Played: <span class="text-gray-300">{{ new Date(match.info.gameCreation).toLocaleString() }}</span></p>
            <p class="text-gray-400 text-sm">Patch: <span class="text-gray-300">{{ match.info.gameVersion }}</span></p>
            <p class="text-gray-400 text-sm">Match ID: <span class="text-gray-300 font-mono">{{ matchId }}</span></p>
        </div>
        <div class="flex justify-center items-center mt-4 mb-16">
            <iframe v-if="match.info.vod" width="560" height="315" :src="match.info.vod" frameborder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
            </iframe>
            <div v-else class="w-full max-w-md rounded-lg bg-gray-800 border border-gray-700 p-6">
                <p class="text-gray-400 text-sm text-center mb-4">No VOD available for this match.</p>
                <div v-if="!showVodForm" class="flex justify-center">
                    <button @click="showVodForm = true" class="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors border border-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Admin: Add VOD
                    </button>
                </div>
                <form v-else @submit.prevent="submitVod" class="flex flex-col gap-3">
                    <input
                        v-model="vodUrl"
                        type="url"
                        placeholder="https://www.youtube.com/embed/..."
                        class="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-logo-blue"
                        required
                    />
                    <input
                        v-model="vodPassword"
                        type="password"
                        placeholder="Admin password"
                        class="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-logo-blue"
                        required
                    />
                    <div class="flex gap-2">
                        <button type="submit" :disabled="vodSubmitting" class="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-md transition-colors">
                            {{ vodSubmitting ? 'Saving…' : 'Save VOD' }}
                        </button>
                        <button type="button" @click="showVodForm = false" class="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors">
                            Cancel
                        </button>
                    </div>
                    <p v-if="vodMessage" class="text-xs text-center" :class="vodError ? 'text-red-400' : 'text-green-400'">{{ vodMessage }}</p>
                </form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ChampionIcon from '@/components/ChampionIcon.vue';
import axios from 'axios'
import { DDRAGON_URL } from '@/config.js';
import teamsData from '@/data/teamsData.json';

export default {
    name: 'MatchDetail',
    components: {
        ChampionIcon
    },
    setup() {
        const route = useRoute()
        const matchId = ref(route.params.matchId.replace(/^NA1_/, ''))
        const match = ref(null)
        const fromPlayer = route.query.from === 'player'
        const fromPuuid = route.query.puuid ?? null
        const fromPlayerName = route.query.playerName ?? null
        const fromTeam = route.query.from === 'team'
        const fromTeamId = route.query.teamId ?? null
        const fromTeamName = route.query.teamName ?? null

        onMounted(async () => {
            // Fetch match details using matchId
            const response = await axios.get(import.meta.env.VITE_API_URL + `/matches/${matchId.value}`)
            console.log(response)
            const data = response.data.data
            const minutes = Math.floor(data.info.gameDuration/60)
            const seconds = String(data.info.gameDuration % 60).padStart(2, '0')
            data.info.gameDuration = `${minutes}:${seconds}`

            data.info.teams.forEach(team => {
                team.bans.sort((a, b) =>
                    a.pickTurn - b.pickTurn
                )

            })
            match.value = data
        })

        const showVodForm = ref(false)
        const vodUrl = ref('')
        const vodPassword = ref('')
        const vodSubmitting = ref(false)
        const vodMessage = ref('')
        const vodError = ref(false)

        const submitVod = async () => {
            vodSubmitting.value = true
            vodMessage.value = ''
            vodError.value = false
            try {
                await axios.patch(
                    `${import.meta.env.VITE_API_URL}/matches/${matchId.value}/vod`,
                    { vod: vodUrl.value, password: vodPassword.value }
                )
                match.value.info.vod = vodUrl.value
                vodMessage.value = 'VOD saved!'
                showVodForm.value = false
            } catch (e) {
                vodError.value = true
                vodMessage.value = e.response?.data?.message ?? 'Failed to save VOD.'
            } finally {
                vodSubmitting.value = false
                vodPassword.value = ''
            }
        }

        const getItemImageUrl = (image) => {
            return image.startsWith('http') ? image : `${DDRAGON_URL}${image}`
        }

        const getTeamTricode = (teamName) => {
            const team = teamsData.teams.find(t => t.name === teamName)
            return team?.tricode ?? teamName
        }

        const getTeamLogo = (teamName) => {            const teamLogos = {
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

        return {
            matchId,
            match,
            DDRAGON_URL,
            getItemImageUrl,
            getTeamLogo,
            getTeamTricode,
            fromPlayer,
            fromPuuid,
            fromPlayerName,
            fromTeam,
            fromTeamId,
            fromTeamName,
            showVodForm,
            vodUrl,
            vodPassword,
            vodSubmitting,
            vodMessage,
            vodError,
            submitVod
        }
    }
}
</script>

<style scoped>
.reverse-table {
    direction: rtl;
}

.reverse-table th,
.reverse-table td {
    direction: ltr;
}
@media (max-width: 1280px) {
    .reverse-table {
        direction: ltr;
    }

    .reverse-table th,
    .reverse-table td {
        direction: ltr;
    }
}

.blue-filter {
    filter: hue-rotate(30deg) brightness(0.8);

}

.red-filter {
    filter: hue-rotate(-15deg) brightness(0.8);
}

.blue-filter2 {
    filter: hue-rotate(-90deg) brightness(0.8);
}
</style>