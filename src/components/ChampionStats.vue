<template>
    <!-- CHAMPION STATS -->
    <div v-if="player?.championStats" class="xl:col-span-4 mt-8 overflow-x-auto">
        <div>
            <h3 class="text-xl mb-4">Champion Stats</h3>
            <button v-for="season in player.seasons" :key="season" @click="selectedSeason = season"
                class="border border-gray-300 rounded-lg px-4 mx-2">{{ season }}</button>
            <button @click="selectedSeason = 'allTime'" class="border border-gray-300 rounded-lg px-2 mx-2">All
                Time</button>
        </div>

        <div class="">
            <table class="">
                <thead>
                    <tr>
                        <th class="py-2 px-2 border-b">Champ</th>
                        <th class="py-2 px-2 border-b">Games</th>
                        <th class="py-2 px-2 border-b">Win</th>
                        <th class="py-2 px-2 border-b">Loss</th>
                        <th class="py-2 px-2 border-b">Win Rate</th>
                        <th class="min-w-28 py-2 px-2 border-b"><span>KDA</span><span class="text-logo-red">
                                (KP%)</span> </th>
                        <th class="min-w-20 py-2 px-2 border-b">Gold</th>
                        <th class="min-w-20 py-2 px-2 border-b"><span>CS</span><span class="text-logo-red">
                                (@14)</span> </th>
                        <th class="min-w-20 py-2 px-2 border-b">Vision</th>
                        <th class="min-w-20 py-2 px-2 border-b">Damage</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- TODO: Highlight highest stat values -->
                    <tr class="text-center align-middle" v-for="champion in player.championStats[selectedSeason]"
                        v-bind:key="champion.champion.name">
                        <td class="py-2 px-2 border-b">
                            <div class="flex justify-center items-center">
                                <img class="rounded-full w-10 h-10" :src="champion.champion.image.square" />
                            </div>
                        </td>
                        <td class="py-2 px-2 border-b ">
                            <div class="">
                                <span>{{ champion.gamesPlayed }}</span><br />
                            </div>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span class="">{{ champion.wins }}</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span class="">{{ champion.losses }}</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <div class="flex justify-center items-center">
                                <span>{{ champion.wins / champion.gamesPlayed * 100 }}%</span>
                            </div>
                        </td>
                        <td class="py-2 px-2 border-b ">
                            <span>{{ champion.kills }}/{{ champion.deaths }}/{{ champion.assists }}</span>
                            <span class="text-logo-red"> ({{ Math.round(champion.killParticipation * 100)
                                }}%)</span><br />
                            <span class="text-xs text-logo-blue">{{ champion.kda }} KDA</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span>{{ champion.goldEarned }}</span><br />
                            <span class="text-logo-blue text-xs"> {{ Math.round(champion.goldPerMinute)
                                }} GPM</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span>{{ champion.cs }}</span><span class="text-logo-red text-xs"> ({{ champion.cs14
                                }})</span><br />
                            <span class="text-logo-blue text-xs"> {{ champion.csm }} CSM</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span>{{ champion.visionScore }}</span><br />
                            <span class="text-logo-blue text-xs"> {{ Math.round(champion.visionScorePerMinute)
                                }}
                                VsPM</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span>{{ champion.totalDamageDealtToChampions }}</span><br />
                            <span class="text-logo-blue text-xs"> {{ Math.round(champion.damagePerMinute) }}
                                DPM</span>
                        </td>

                    </tr>
                    <tr class="text-center align-middle">
                        <td class="py-2 px-2 border-b">
                            <div class="flex justify-center items-center">
                                <span>Overall</span>
                            </div>
                        </td>
                        <td class="py-2 px-2 border-b ">
                            <div class="">
                                <span>{{ player.aggregateStats[selectedSeason].gamesPlayed }}</span><br />
                            </div>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span class="">{{ player.aggregateStats[selectedSeason].wins }}</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span class="">{{ player.aggregateStats[selectedSeason].losses }}</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <div class="flex justify-center items-center">
                                <span>{{ Math.round(player.aggregateStats[selectedSeason].wins /
                                    player.aggregateStats[selectedSeason].gamesPlayed * 100) }}%</span>
                            </div>
                        </td>
                        <td class="py-2 px-2 border-b ">
                            <span>{{ player.aggregateStats[selectedSeason].kills }}/{{
                                player.aggregateStats[selectedSeason].deaths }}/{{
                                    player.aggregateStats[selectedSeason].assists }}</span>
                            <span class="text-logo-red"> ({{
                                Math.round(player.aggregateStats[selectedSeason].killParticipation * 100)
                                }}%)</span><br />
                            <span class="text-xs text-logo-blue">{{ player.aggregateStats[selectedSeason].kda }}
                                KDA</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span>{{ player.aggregateStats[selectedSeason].goldEarned }}</span><br />
                            <span class="text-logo-blue text-xs"> {{
                                Math.round(player.aggregateStats[selectedSeason].goldPerMinute)
                                }} GPM</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span>{{ player.aggregateStats[selectedSeason].cs }}</span><span
                                class="text-logo-red text-xs"> ({{ player.aggregateStats[selectedSeason].cs14
                                }})</span><br />
                            <span class="text-logo-blue text-xs"> {{ player.aggregateStats[selectedSeason].csm }}
                                CSM</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span>{{ player.aggregateStats[selectedSeason].visionScore }}</span><br />
                            <span class="text-logo-blue text-xs"> {{
                                Math.round(player.aggregateStats[selectedSeason].visionScorePerMinute)
                                }}
                                VsPM</span>
                        </td>
                        <td class="py-2 px-2 border-b">
                            <span>{{ player.aggregateStats[selectedSeason].totalDamageDealtToChampions }}</span><br />
                            <span class="text-logo-blue text-xs"> {{
                                Math.round(player.aggregateStats[selectedSeason].damagePerMinute) }}
                                DPM</span>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>