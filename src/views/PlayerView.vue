<template>
    <!-- PLAYER CARD -->
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div class="flex justify-center xl:col-span-1 mt-16">
            <PlayerCard :player="player" />
        </div>

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
                                    <span>{{ champion.wins/champion.gamesPlayed *100 }}%</span>
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
                                    <span>{{ Math.round(player.aggregateStats[selectedSeason].wins / player.aggregateStats[selectedSeason].gamesPlayed * 100) }}%</span>
                                </div>
                            </td>
                            <td class="py-2 px-2 border-b ">
                                <span>{{ player.aggregateStats[selectedSeason].kills }}/{{ player.aggregateStats[selectedSeason].deaths }}/{{ player.aggregateStats[selectedSeason].assists }}</span>
                                <span class="text-logo-red"> ({{ Math.round(player.aggregateStats[selectedSeason].killParticipation * 100)
                                    }}%)</span><br />
                                <span class="text-xs text-logo-blue">{{ player.aggregateStats[selectedSeason].kda }} KDA</span>
                            </td>
                            <td class="py-2 px-2 border-b">
                                <span>{{ player.aggregateStats[selectedSeason].goldEarned }}</span><br />
                                <span class="text-logo-blue text-xs"> {{ Math.round(player.aggregateStats[selectedSeason].goldPerMinute)
                                    }} GPM</span>
                            </td>
                            <td class="py-2 px-2 border-b">
                                <span>{{ player.aggregateStats[selectedSeason].cs }}</span><span class="text-logo-red text-xs"> ({{ player.aggregateStats[selectedSeason].cs14
                                    }})</span><br />
                                <span class="text-logo-blue text-xs"> {{ player.aggregateStats[selectedSeason].csm }} CSM</span>
                            </td>
                            <td class="py-2 px-2 border-b">
                                <span>{{ player.aggregateStats[selectedSeason].visionScore }}</span><br />
                                <span class="text-logo-blue text-xs"> {{ Math.round(player.aggregateStats[selectedSeason].visionScorePerMinute)
                                    }}
                                    VsPM</span>
                            </td>
                            <td class="py-2 px-2 border-b">
                                <span>{{ player.aggregateStats[selectedSeason].totalDamageDealtToChampions }}</span><br />
                                <span class="text-logo-blue text-xs"> {{ Math.round(player.aggregateStats[selectedSeason].damagePerMinute) }}
                                    DPM</span>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

        <!-- MATCH DETAILS -->
        <div v-if="matchDetails" class="xl:col-span-5 mt-8 overflow-x-auto">
            <h2 class="text-xl mb-4">Match Details</h2>
            <div class="">
                <table class="">
                    <thead>
                        <tr class="">
                            <th class="min-w-24 py-2 px-2 border-b">Team</th>
                            <th class="min-w-24 py-2 px-2 border-b">VS</th>
                            <th class="py-2 px-2 border-b">Date</th>
                            <th class="py-2 px-2 border-b">Side</th>
                            <th class="py-2 px-2 border-b">Result</th>
                            <th class="py-2 px-2 border-b">Champion</th>
                            <th class="py-2 px-2 border-b">KDA</th>
                            <th class="min-w-60 py-2 px-2 border-b">Build</th>
                            <th class="min-w-32 py-2 px-2 border-b">Spells</th>
                            <th class="py-2 px-2 border-b">VOD</th>
                        </tr>
                    </thead>
                    <tbody class="">
                        <tr v-for="match in matchDetails" :key="match.matchId" class="text-center align-middle cursor-pointer
                            hover:bg-indigo" @click="goToMatchDetail(match.matchId)">
                            <td class="py-2 px-2 border-b"><span class="inline-block align-middle text-center"><img
                                        class="max-w-16 h-8 " :src="`${match.team.image}`" :title="`${match.team.name}`"
                                        :alt="`${match.team.name}`" /></span></td>
                            <td class="py-2 px-2 border-b"><span class="inline-block align-middle text-center"><img
                                        class="max-w-16 h-8 align-middle" :src="`${match.vs.teamImage}`"
                                        :title="`${match.vs.teamName}`" :alt="`${match.vs.teamName}`" /></span></td>
                            <td class="py-2 px-2 border-b">{{ match.team.side }}</td>
                            <td class="py-2 px-2 border-b">{{ match.win ? 'Win' : 'Loss' }}</td>
                            <td class="py-2 px-2 border-b">{{ new Date(match.gameStartTimestamp).toLocaleDateString() }}
                            </td>
                            <td class="py-2 px-2 border-b whitespace-nowrap text-center align-middle">
                                <span class="inline-block align-middle">
                                    <img class="w-8 h-8" :src="`${match.champion.image.square}`"
                                        :title="`${match.champion.name}`" :alt="`${match.champion.name}`" />
                                </span>
                                <span class="inline-block align-middle text-center">VS</span>
                                <span class="inline-block align-middle">
                                    <img class="w-8 h-8" :src="`${match.vs.championImage.square}`"
                                        :title="`${match.vs.championName}`" :alt="`${match.vs.championName}`" />
                                </span>
                            </td>
                            <td class="py-2 px-2 border-b">{{ match.kills }}/{{ match.deaths }}/{{ match.assists }}</td>
                            <td class="py-2 px-2 border-b whitespace-nowrap">
                                <span v-for="item in match.build" :key="item"
                                    class="inline-block text-center align-middle">
                                    <img class="w-8 h-8 align-middle" :src="`${item.image}`" :title="`${item.name}`"
                                        :alt="`${item.name}`" />
                                </span>
                            </td>
                            <td class="py-2 px-2 border-b whitespace-nowrap">
                                <span v-for="spell in match.summonerSpells" :key="spell"
                                    class="inline-block text-center align-middle">
                                    <img class="w-8 h-8 align-middle" :src="`${spell.image}`" :title="`${spell.name}`"
                                        :alt="`${spell.name}`" />
                                </span>
                                <span class="inline-block align-middle">
                                    <img class="w-8 h-8" :src="`${match.runes.primary.keystone.image}`"
                                        :title="`${match.runes.primary.keystone.name}`" />
                                </span>
                            </td>
                            <td class="py-2 px-2 border-b">
                                <a :href="`${match.vod}`" target="_blank" rel="noopener noreferrer"
                                    class="text-blue-500">VOD</a>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import playerData from '../data/playerData.json'
import PlayerCard from '@/components/PlayerCard.vue';
export default {
    name: 'PlayerView',
    props: {
        puuid: {
            type: String,
            required: true
        }
    },
    components: {
        PlayerCard
    },
    setup(props) {
        const player = ref(null)
        const matchDetails = ref([])
        const router = useRouter()
        const selectedSeason = ref('allTime')

        const goToMatchDetail = (matchId) => {
            router.push(`/match/${matchId}`)
        }

        onMounted(async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/players/${props.puuid}`)
                // const response = playerData

                console.log(response.data)

                // const testMatchList = []
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // testMatchList.push(response.data.matches[0])
                // matchDetails.value = testMatchList
                matchDetails.value = response.data.match_history
                player.value = response.data
                console.log(player.value)
            } catch (error) {
                console.error('Error fetching player data:', error)
            }
        })

        return {
            player,
            matchDetails,
            goToMatchDetail,
            selectedSeason
        }
    }
}
</script>