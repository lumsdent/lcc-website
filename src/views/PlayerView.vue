<template>
    <div class="flex flex-col md:flex-row gap-8">
        <div class="border border-gray-300 rounded-lg p-4 max-w-xs text-center shadow-md">
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
            <a :href="`https://www.op.gg/summoners/na/${player.playerName}-${player.tagline}`" target="_blank"
                rel="noopener noreferrer" class="block mt-4 text-blue-500 hover:underline">OP.GG</a>
        </div>

        <div class="mt-8">
            <h2 class="text-xl mb-4">Match Details</h2>
            <table class="min-w-full border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr class="">
                        <th class="py-2 px-4 border-b">Team</th>
                        <th class="py-2 px-4 border-b">VS</th>
                        <th class="py-2 px-4 border-b">Champion</th>
                        <th class="py-2 px-4 border-b">KDA</th>
                        <th class="py-2 px-4 border-b">Build</th>
                        <th class="py-2 px-4 border-b">Spells</th>
                        <th class="py-2 px-4 border-b">Result</th>
                        <th class="py-2 px-4 border-b">Date</th>
                    </tr>
                </thead>
                <tbody class="">
                    <tr v-for="match in player.matchDetails" :key="match.matchId" class="">
                        <td class="py-2 px-4 border-b">{{ match.team }}</td>
                        <td class="py-2 px-4 border-b">{{ match.vs.team }}</td>
                        <td class="py-2 px-4 flex"><img class="w-10 h-10"
                                :src="`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${match.championName}.png`"
                                :alt="`${match.championName}`" /> VS <img class="w-10 h-10"
                                :src="`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${match.vs.championName}.png`"
                                :alt="`${match.vs.championName}`" /></td>
                        <td class="py-2 px-4 border-b">{{ match.kills }}/{{ match.deaths }}/{{ match.assists }}</td>
                        <td class="py-2 px-4 flex">
                            <img v-for="i in 6" :key="i" class="w-8 h-8"
                                :src="`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/${ match[`item${ i }`] }.png`" />
                        </td>
                        <td class="py-2 px-4 flex">
                            <img v-for="spell in match.spells" :key="spell" class="w-8 h-8"
                                :src="`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/spell/${spell}`" />
                            <img class="w-8 h-8"
                                :src="`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/spell/SummonerFlash.png`" />
                            <img class="w-8 h-8"
                                :src="`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/spell/SummonerDot.png`" />
                            <img class="w-8 h-8"
                                :src="`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png`" />
                        </td>
                        <td class="py-2 px-4 border-b">{{ match.win ? 'Win' : 'Loss' }}</td>
                        <td class="py-2 px-4 border-b">{{ new Date(match.gameStartTimestamp).toLocaleDateString() }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

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
            description: 'Team Description',
            profilePicture: '',
            summonerLevel: 0,
            matches: [],
            favoriteChampions: [],
            matchDetails: []
        })
        const profilePictureUrl = ref('')

        onMounted(async () => {
            try {
                // const response = await axios.get(`${import.meta.env.VITE_API_URL}/players/${props.puuid}`)

                const response =JSON.parse(`{"data": {
    "_id": { "$oid": "66ef3ce4b35c8269fae088be" },
    "puuid": "c2xoTJ33QjBVjNX4U2IzxcvMwd9keVQE0M0AcoJfh9l_82XMZSo07zyjg87RmWV-KjnlXqMzqcFm-A",
    "userName": "TopDiff",
    "userTag": "NA",
    "summonerLevel": 30,
    "email": "topdiff@gmail.com",
    "bio": "I'm a top laner who loves to play tanks and bruisers.",
    "profileIconId": 505,
    "teams": [{ "1": "LCC_Champs" }, { "2": "LCC_Chumps" }],
    "matches": [{"team": "Ixtali Iguanas", "matchId": "45679284863", 

    "gameStartTimestamp": 1728690874545,

    "allInPings": 0,
              "assistMePings": 0,
              "assists": 12,
              "baronKills": 0,
              "basicPings": 0,
              "bountyLevel": 0,
              "champExperience": 14069,
              "champLevel": 15,
              "championId": 223,
              "championName": "TahmKench",
              "championTransform": 0,
              "commandPings": 0,
              "consumablesPurchased": 1,
              "damageDealtToBuildings": 10116,
              "damageDealtToObjectives": 17056,
              "damageDealtToTurrets": 10116,
              "damageSelfMitigated": 35906,
              "dangerPings": 0,
              "deaths": 5,
              "detectorWardsPlaced": 0,
              "doubleKills": 0,
              "dragonKills": 0,
              "eligibleForProgression": true,
              "enemyMissingPings": 0,
              "enemyVisionPings": 0,
              "firstBloodAssist": false,
              "firstBloodKill": false,
              "firstTowerAssist": false,
              "firstTowerKill": false,
              "gameEndedInEarlySurrender": false,
              "gameEndedInSurrender": false,
              "getBackPings": 0,
              "goldEarned": 10347,
              "goldSpent": 8250,
              "holdPings": 0,
              "individualPosition": "TOP",
              "inhibitorKills": 0,
              "inhibitorTakedowns": 4,
              "inhibitorsLost": 0,
              "item0": 1054,
              "item1": 3084,
              "item2": 2031,
              "item3": 3009,
              "item4": 4633,
              "item5": 3067,
              "item6": 3340,
              "itemsPurchased": 14,
              "killingSprees": 1,
              "kills": 6,
              "lane": "TOP",
              "largestCriticalStrike": 0,
              "largestKillingSpree": 2,
              "largestMultiKill": 1,
              "longestTimeSpentLiving": 554,
              "magicDamageDealt": 55830,
              "magicDamageDealtToChampions": 14714,
              "magicDamageTaken": 11896,
              "needVisionPings": 0,
              "neutralMinionsKilled": 0,
              "nexusKills": 0,
              "nexusLost": 0,
              "nexusTakedowns": 0,
              "objectivesStolen": 0,
              "objectivesStolenAssists": 0,
              "onMyWayPings": 2,
              "participantId": 1,
              "pentaKills": 0,
              "perks": {
                  "statPerks": {
                      "defense": 5001,
                      "flex": 5001,
                      "offense": 5005
                  },
                  "styles": [
                      {
                          "description": "primaryStyle",
                          "selections": [
                              {
                                  "perk": 8437,
                                  "var1": 1234,
                                  "var2": 833,
                                  "var3": 0
                              },
                              {
                                  "perk": 8401,
                                  "var1": 574,
                                  "var2": 0,
                                  "var3": 0
                              },
                              {
                                  "perk": 8444,
                                  "var1": 2758,
                                  "var2": 0,
                                  "var3": 0
                              },
                              {
                                  "perk": 8242,
                                  "var1": 176,
                                  "var2": 0,
                                  "var3": 0
                              }
                          ],
                          "style": 8400
                      },
                      {
                          "description": "subStyle",
                          "selections": [
                              {
                                  "perk": 8304,
                                  "var1": 10,
                                  "var2": 3,
                                  "var3": 0
                              },
                              {
                                  "perk": 8410,
                                  "var1": 101,
                                  "var2": 0,
                                  "var3": 0
                              }
                          ],
                          "style": 8300
                      }
                  ]
              },
              "physicalDamageDealt": 17960,
              "physicalDamageDealtToChampions": 3587,
              "physicalDamageTaken": 26598,
              "placement": 0,
              "playerAugment1": 0,
              "playerAugment2": 0,
              "playerAugment3": 0,
              "playerAugment4": 0,
              "playerAugment5": 0,
              "playerAugment6": 0,
              "playerSubteamId": 0,
              "profileIcon": 1109,
              "pushPings": 0,
              "puuid": "c2xoTJ33QjBVjNX4U2IzxcvMwd9keVQE0M0AcoJfh9l_82XMZSo07zyjg87RmWV-KjnlXqMzqcFm-A",
              "quadraKills": 0,
              "riotIdGameName": "Oasis psychotikk",
              "riotIdTagline": "OAS",
              "role": "SOLO",
              "sightWardsBoughtInGame": 0,
              "spell1Casts": 119,
              "spell2Casts": 26,
              "spell3Casts": 13,
              "spell4Casts": 8,
              "subteamPlacement": 0,
              "summoner1Casts": 3,
              "summoner1Id": 4,
              "summoner2Casts": 4,
              "summoner2Id": 12,
              "summonerId": "ZSMhdPYmnm_DnYpRp4cclfnMsbq35be5CrUxqRKMzykvgLI",
              "summonerLevel": 483,
              "summonerName": "psychotikkittens",
              "teamEarlySurrendered": false,
              "teamId": 100,
              "teamPosition": "TOP",
              "timeCCingOthers": 35,
              "timePlayed": 1707,
              "totalAllyJungleMinionsKilled": 0,
              "totalDamageDealt": 78003,
              "totalDamageDealtToChampions": 18301,
              "totalDamageShieldedOnTeammates": 0,
              "totalDamageTaken": 39600,
              "totalEnemyJungleMinionsKilled": 0,
              "totalHeal": 9787,
              "totalHealsOnTeammates": 0,
              "totalMinionsKilled": 124,
              "totalTimeCCDealt": 264,
              "totalTimeSpentDead": 148,
              "totalUnitsHealed": 1,
              "tripleKills": 0,
              "trueDamageDealt": 4212,
              "trueDamageDealtToChampions": 0,
              "trueDamageTaken": 1105,
              "turretKills": 2,
              "turretTakedowns": 4,
              "turretsLost": 4,
              "unrealKills": 0,
              "visionClearedPings": 0,
              "visionScore": 9,
              "visionWardsBoughtInGame": 0,
              "wardsKilled": 0,
              "wardsPlaced": 5,
              "win": true,
              "vs": {
                "team": "Chump Changers",
                "allInPings": 0,
                "assistMePings": 0,
                "assists": 12,
                "baronKills": 0,
                "basicPings": 0,
                "bountyLevel": 0,
                "champExperience": 14069,
                "champLevel": 14,
                "championId": 223,
                "championName": "Garen",
                "championTransform": 0,
                "commandPings": 0,
                "consumablesPurchased": 1,
                "damageDealtToBuildings": 10116,
                "damageDealtToObjectives": 17056,
                "damageDealtToTurrets": 10116,
                "damageSelfMitigated": 35906,
                "dangerPings": 0,
                "deaths": 5,
                "detectorWardsPlaced": 0,
                "doubleKills": 0,
                "dragonKills": 0,
                "eligibleForProgression": true,
                "enemyMissingPings": 0,
                "enemyVisionPings": 0,
                "firstBloodAssist": false,
                "firstBloodKill": false,
                "firstTowerAssist": false,
                "firstTowerKill": false,
                "gameEndedInEarlySurrender": false,
                "gameEndedInSurrender": false,
                "getBackPings": 0,
                "goldEarned": 10347,
                "goldSpent": 8250,
                "holdPings": 0,
                "individualPosition": "TOP",
                "inhibitorKills": 0,
                "inhibitorTakedowns": 4,
                "inhibitorsLost": 0,
                "item0": 1054,
                "item1": 3084,
                "item2": 2031,
                "item3": 3009,
                "item4": 4633,
                "item5": 3067,
                "item6": 3340,
                "itemsPurchased": 14,
                "killingSprees": 1,
                "kills": 6,
                "lane": "TOP",
                "largestCriticalStrike": 0,
                "largestKillingSpree": 2,
              "largestMultiKill": 1,
              "longestTimeSpentLiving": 554,
              "magicDamageDealt": 55830,
              "magicDamageDealtToChampions": 14714,
              "magicDamageTaken": 11896,
              "needVisionPings": 0,
              "neutralMinionsKilled": 0,
              "nexusKills": 0,
              "nexusLost": 0,
              "nexusTakedowns": 0,
              "objectivesStolen": 0,
              "objectivesStolenAssists": 0,
              "onMyWayPings": 2,
              "participantId": 1,
              "pentaKills": 0,
              "physicalDamageDealt": 17960,
              "physicalDamageDealtToChampions": 3587,
              "physicalDamageTaken": 26598,
              "placement": 0,
              "playerAugment1": 0,
              "playerAugment2": 0,
              "playerAugment3": 0,
              "playerAugment4": 0,
              "playerAugment5": 0,
              "playerAugment6": 0,
              "playerSubteamId": 0,
              "profileIcon": 1109,
              "pushPings": 0,
              "puuid": "c2xoTJ33QjBVjNX4U2IzxcvMwd9keVQE0M0AcoJfh9l_82XMZSo07zyjg87RmWV-KjnlXqMzqcFm-A",
              "quadraKills": 0,
              "riotIdGameName": "Oasis psychotikk",
              "riotIdTagline": "OAS",
              "role": "SOLO",
              "sightWardsBoughtInGame": 0,
              "spell1Casts": 119,
              "spell2Casts": 26,
              "spell3Casts": 13,
              "spell4Casts": 8,
              "subteamPlacement": 0,
              "summoner1Casts": 3,
              "summoner1Id": 4,
              "summoner2Casts": 4,
              "summoner2Id": 12,
              "summonerId": "ZSMhdPYmnm_DnYpRp4cclfnMsbq35be5CrUxqRKMzykvgLI",
              "summonerLevel": 483,
              "summonerName": "psychotikkittens",
              "teamEarlySurrendered": false,
              "teamId": 100,
              "teamPosition": "TOP",
              "timeCCingOthers": 35,
              "timePlayed": 1707,
              "totalAllyJungleMinionsKilled": 0,
              "totalDamageDealt": 78003,
              "totalDamageDealtToChampions": 18301,
              "totalDamageShieldedOnTeammates": 0,
              "totalDamageTaken": 39600,
              "totalEnemyJungleMinionsKilled": 0,
              "totalHeal": 9787,
              "totalHealsOnTeammates": 0,
              "totalMinionsKilled": 124,
              "totalTimeCCDealt": 264,
              "totalTimeSpentDead": 148,
              "totalUnitsHealed": 1,
              "tripleKills": 0,
              "trueDamageDealt": 4212,
              "trueDamageDealtToChampions": 0,
              "trueDamageTaken": 1105,
              "turretKills": 2,
              "turretTakedowns": 4,
              "turretsLost": 4,
              "unrealKills": 0,
              "visionClearedPings": 0,
              "visionScore": 9,
              "visionWardsBoughtInGame": 0,
              "wardsKilled": 0,
              "wardsPlaced": 5,
              "win": false}}],
    "primaryRole": "Top",
    "secondaryRole": "Jungle",
    "champ_stats": [
      {
          "champion": "Aatrox",
          "games_played": "10",
          "kills": "45",
          "deaths": "42",
          "assists": "63"
        },
        {
          "champion": "Darius",
          "games_played": "5",
          "kills": "23",
          "deaths": "12",
          "assists": "34"
        },
        {
          "champion": "Garen",
          "games_played": "7",
          "kills": "23",
          "deaths": "12",
          "assists": "34"
        },
        {
          "champion": "Tahm Kench",
          "games_played": "3",
          "kills": "23",
          "deaths": "12",
          "assists": "34"
        },
        {
          "champion": "Mordekaiser",
          "games_played": "1",
          "kills": "23",
          "deaths": "12",
          "assists": "34"
        }
      ],
     
      "aggregate_stats": {
          "games_played": "15",
          "kills": "68",
          "deaths": "54",
          "assists": "97"
        }
            }}`)
                console.log(response.data)
                const { profileIconId, summonerLevel, userName, matches, teams, tagLine } = response.data
                console.log(profileIconId, summonerLevel, teams)
                profilePictureUrl.value = `https://ddragon.leagueoflegends.com/cdn/14.19.1/img/profileicon/${profileIconId}.png`
                player.value.profilePicture = profilePictureUrl.value
                player.value.summonerLevel = summonerLevel
                player.value.playerName = userName
                player.value.tagline = tagLine
                player.value.teamName = Object.values(teams[teams.length - 1])[0]
                player.value.matches = matches
                player.value.favoriteChampions = response.data.champ_stats.sort((a, b) => b.games_played - a.games_played).slice(0, 3);
                player.value.matchDetails = response.data.matches
                const r = await axios.get("https://ddragon.leagueoflegends.com/cdn/14.20.1/data/en_US/summoner.json")
                const summoners = r.data.data
                console.log(summoners)
                player.value.matchDetails.forEach(match => {
                    match.spells = [summoners[match.summoner1Id].image.full, summoners[match.summoner2Id].image.full]
                })
            } catch (error) {
                console.error('Error fetching player data:', error)
            }
        })

        return {
            player,
            profilePictureUrl
        }
    }
}
</script>