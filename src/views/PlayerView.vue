<template>
    <!-- PLAYER CARD -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div class="flex justify-center xl:col-span-1 mt-16">
            <PlayerCard :player="player" />
        </div>



        <!-- MATCH DETAILS -->
        <div v-if="matchDetails" class="xl:col-span-3 mt-8 overflow-x-auto">
            <h2 class="text-xl mb-4">Match Details</h2>
            <div class="">
                <table class="">
                    <thead>
                        <tr class="">
                            <th class="min-w-24 py-2 px-2 border-b">Team</th>
                            <th class="min-w-24 py-2 px-2 border-b">VS</th>
                            <th class="py-2 px-2 border-b">Date</th>
                            <!-- <th class="py-2 px-2 border-b">Side</th> -->
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
                            <td class="py-2 px-2 border-b">
                                <!-- <span class="inline-block align-middle text-center">
                                <img class="max-w-16 h-8 " :src="`${match.team.image}`" :title="`${match.team.name}`"
                                        :alt="`${match.team.name}`" />
                                </span> -->
                                {{ match.team.name }}
                            </td>
                            <td class="py-2 px-2 border-b">
                                <!-- <span class="inline-block align-middle text-center"><img
                                        class="max-w-16 h-8 align-middle" :src="`${match.vs.teamImage}`"
                                        :title="`${match.vs.teamName}`" :alt="`${match.vs.teamName}`" /></span> -->
                                {{ match.vs.teamName }}
                            </td>
                            <td class="py-2 px-2 border-b">{{ new Date(match.gameStartTimestamp).toLocaleDateString() }}
                            </td>
                            <!-- <td class="py-2 px-2 border-b">{{ match.team.side }}</td> -->
                            <td class="py-2 px-2 border-b">{{ match.win ? 'Win' : 'Loss' }}</td>
                            <td class="py-2 px-2 border-b whitespace-nowrap text-center align-middle">
                                <span class="inline-block align-middle">
                                    <img class="w-8 h-8" :src="`${DDRAGON_URL}${match.champion.image.square}`"
                                        :title="`${match.champion.name}`" :alt="`${match.champion.name}`" />
                                </span>
                                <span class="inline-block align-middle text-center">VS</span>
                                <span class="inline-block align-middle">
                                    <img class="w-8 h-8" :src="`${DDRAGON_URL}${match.vs.championImage.square}`"
                                        :title="`${match.vs.championName}`" :alt="`${match.vs.championName}`" />
                                </span>
                            </td>
                            <td class="py-2 px-2 border-b">{{ match.kills }}/{{ match.deaths }}/{{ match.assists }}</td>
                            <td class="py-2 px-2 border-b whitespace-nowrap">
                                <span v-for="item in match.build" :key="item"
                                    class="inline-block text-center align-middle">
                                    <img class="w-8 h-8 align-middle" :src="getItemImageUrl(item.image)"
                                        :title="`${item.name}`" :alt="`${item.name}`" />
                                </span>
                            </td>
                            <td class="py-2 border-b whitespace-nowrap">
                                <span v-for="spell in match.summonerSpells" :key="spell"
                                    class="inline-block text-center align-middle">
                                    <img class="w-8 h-8 align-middle" :src="`${DDRAGON_URL}${spell.image}`"
                                        :title="`${spell.name}`" :alt="`${spell.name}`" />
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
        <div v-else class="xl:col-span-3 mt-8 overflow-x-auto">
            <h2 class="text-xl mb-4">Match Details</h2>
            <p>No match history available</p>
        </div>
    </div>

</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PlayerCard from '@/components/PlayerCard.vue';
import { DDRAGON_URL } from '@/config.js';
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

        const getItemImageUrl = (image) => {
            return image.startsWith('http') ? image : `${DDRAGON_URL}${image}`
        }

        onMounted(async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/players/${props.puuid}`)

                console.log(response.data)

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
            selectedSeason,
            DDRAGON_URL,
            getItemImageUrl
        }
    }
}
</script>