<template>
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div class="flex justify-center xl:col-span-1">
            <div class="border border-gray-300 max-w-sm rounded-lg p-4 text-center max-h-fit mt-16 justify-center">
                <img :src="player.profilePicture" alt="Profile Picture" class="w-full h-auto rounded-full" />
                <h2 class="mt-4 mb-2 text-xl">{{ player.playerName }}</h2>
                <p class="text-gray-600">{{ player.summonerLevel }}</p>
                <h3 class="mt-4 mb-2 text-l">Current Team</h3>
                <p class="mt-4">{{ player.teamName }}</p>
                <div class="flex justify-center mt-4 space-x-2">
                    <img v-for="champ in player.favoriteChampions" v-bind:key="champ.champion"
                        :src="`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${champ.champion}.png`"
                        :alt="`Champion icon: ${champ.champion}`" class="w-12 h-12 rounded-full" />
                </div>
                <p class="mt-4">{{ player.bio }}</p>
                <a :href="`https://www.op.gg/summoners/na/${player.playerName}-${player.tagline}`" target="_blank"
                    rel="noopener noreferrer" class="block mt-4 text-blue-500 ">OP.GG</a>
            </div>
        </div>

        <div class="xl:col-span-4 mt-8 overflow-x-auto">
            <h2 class="text-xl mb-4">Match Details</h2>
            <div class="">
                <table class="border border-gray-300">
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
                        <tr v-for="match in player.matchDetails" :key="match.matchId"
                            class="text-center align-middle cursor-pointer
                            hover:bg-indigo" @click="goToMatchDetail(match.matchId)">
                            <td class="py-2 px-2 border-b"><span class="inline-block align-middle text-center"><img
                                        class="max-w-16 h-8 " :src="`${match.team.image}`" :title="`${match.team.name}`"
                                        :alt="`${match.team.name}`" /></span></td>
                            <td class="py-2 px-2 border-b"><span class="inline-block align-middle text-center"><img
                                        class="max-w-16 h-8 align-middle" :src="`${match.vs.team.image}`"
                                        :title="`${match.vs.team.name}`" :alt="`${match.vs.team.name}`" /></span></td>
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
                                    <img class="w-8 h-8" :src="`${match.vs.champion.image.square}`"
                                        :title="`${match.vs.champion.name}`" :alt="`${match.vs.champion.name}`" />
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
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import playerData from '../data/playerData.json'
export default {
    name: 'PlayerView',
    props: {
        puuid: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const player = ref({
            playerName: 'Player Name',
            tagline: 'Tagline',
            teamName: 'Team Name',
            bio: '',
            profilePicture: '',
            summonerLevel: 0,
            matches: [],
            favoriteChampions: [],
            matchDetails: []
        })
        const profilePictureUrl = ref('')
        const router = useRouter()

        const goToMatchDetail = (matchId) => {
            router.push(`/match/${matchId}`)
        }

        onMounted(async () => {
            try {
                // const response = await axios.get(`${import.meta.env.VITE_API_URL}/players/${props.puuid}`)
                const response = playerData

                console.log(response.data)
                const { profileIconId, summonerLevel, userName, matches, teams, tagLine, bio } = response.data
                console.log(profileIconId, summonerLevel, teams)
                profilePictureUrl.value = `https://ddragon.leagueoflegends.com/cdn/14.19.1/img/profileicon/${profileIconId}.png`
                player.value.profilePicture = profilePictureUrl.value
                player.value.summonerLevel = summonerLevel
                player.value.playerName = userName
                player.value.tagline = tagLine
                player.value.bio = bio
                player.value.teamName = Object.values(teams[teams.length - 1])[0]
                player.value.matches = matches
                player.value.favoriteChampions = response.data.champ_stats.sort((a, b) => b.games_played - a.games_played).slice(0, 3);

                const testMatchList = []
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                testMatchList.push(response.data.matches[0])
                player.value.matchDetails = testMatchList

            } catch (error) {
                console.error('Error fetching player data:', error)
            }
        })

        return {
            player,
            profilePictureUrl,
            goToMatchDetail
        }
    }
}
</script>