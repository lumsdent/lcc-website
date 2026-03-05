<template>
    <!-- BREADCRUMB -->
    <nav class="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <RouterLink to="/players" class="hover:text-white transition-colors">Players</RouterLink>
        <span>/</span>
        <span class="text-gray-300">{{ player?.profile?.name ?? '…' }}</span>
    </nav>

    <!-- PLAYER CARD -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div class="flex flex-col items-center xl:col-span-1 mt-16 gap-3">
            <PlayerCard :player="player" />
            <button
                @click="refreshPlayer"
                :disabled="isRefreshing || !canRefresh"
                class="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform"
                    :class="{ 'animate-spin': isRefreshing }"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ isRefreshing ? 'Refreshing…' : 'Refresh Riot Data' }}
            </button>
            <p v-if="!canRefresh && nextRefreshTime" class="text-xs text-gray-500">Available after {{ nextRefreshTime }}</p>
            <p v-if="refreshMessage" class="text-xs" :class="refreshError ? 'text-red-400' : 'text-green-400'">{{ refreshMessage }}</p>
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
                        <tr v-for="(match, index) in matchDetails" :key="match.matchId" class="text-center align-middle cursor-pointer
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
                            <!-- TEMPORARY -->
                            <!-- <td class="py-2 px-2 border-b" @click.stop>
                                <button class="p-1 text-red-500 hover:text-red-300 focus:outline-none"
                                    @click="deleteMatch(index)" title="Delete match record">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </td> -->
                            <!-- END TEMPORARY -->
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
import { ref, computed, onMounted } from 'vue'
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
        const isRefreshing = ref(false)
        const refreshMessage = ref('')
        const refreshError = ref(false)

        const canRefresh = computed(() => {
            const lastRefreshed = player.value?.profile?.last_refreshed
            if (!lastRefreshed) return true
            const hoursSince = (Date.now() - lastRefreshed) / (1000 * 60 * 60)
            return hoursSince >= 24
        })

        const nextRefreshTime = computed(() => {
            const lastRefreshed = player.value?.profile?.last_refreshed
            if (!lastRefreshed) return null
            const next = new Date(lastRefreshed + 24 * 60 * 60 * 1000)
            return next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })

        const goToMatchDetail = (matchId) => {
            router.push({
                path: `/match/${matchId}`,
                query: {
                    from: 'player',
                    puuid: props.puuid,
                    playerName: player.value?.profile?.name
                }
            })
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

        const refreshPlayer = async () => {
            if (!canRefresh.value) return
            isRefreshing.value = true
            refreshMessage.value = ''
            refreshError.value = false
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/players/${props.puuid}/refresh`)
                player.value = response.data.player
                refreshMessage.value = 'Profile updated!'
            } catch (error) {
                console.error('Error refreshing player:', error)
                refreshError.value = true
                refreshMessage.value = 'Refresh failed.'
            } finally {
                isRefreshing.value = false
            }
        }

        const deleteMatch = async (index) => {
            try {
            
                const response = await axios.delete(
                    `${import.meta.env.VITE_API_URL}/players/${props.puuid}/delete`,
                    {
                        data: {
                            puuid: props.puuid,
                            index: index
                        }
                    }
                );

                if (response.status === 200) {
                    // Remove the match from the local array
                    matchDetails.value.splice(index, 1);
                    alert('Match deleted successfully');
                } else {
                    alert('Failed to delete match');
                }
            } catch (error) {
                console.error('Error deleting match:', error);
                alert('An error occurred while deleting the match');
            }
        }

        return {
            player,
            matchDetails,
            goToMatchDetail,
            selectedSeason,
            DDRAGON_URL,
            getItemImageUrl,
            deleteMatch,
            refreshPlayer,
            isRefreshing,
            canRefresh,
            nextRefreshTime,
            refreshMessage,
            refreshError
        }
    }
}
</script>