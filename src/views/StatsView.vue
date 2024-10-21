<template>
  <div>
    <h3 class="text-xl mb-4">Seasons</h3>
    <div class="flex" v-if="seasons">
      <div v-for="season in seasons" :key="season">
        <button @click="selectedSeason = season" class="border border-gray-300 rounded-lg px-4 mx-2">{{ season
          }}</button>
      </div>
      <button @click="selectedSeason = 'allTime'" class="border border-gray-300 rounded-lg px-4 mx-2">All Time</button>
    </div>
  </div>
  <div>
    <h3 class="text-xl mb-4">Player Stats</h3>
    <div v-if="players.length > 0" class="text-center">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="py-2 px-2 border-b">
              Player
            </th>
            <th class="py-2 px-2 border-b">
              Matches Played
            </th>
            <th class="py-2 px-2 border-b">
              Minutes Played
            </th>
            <th class="py-2 px-2 border-b">
              Kills
            </th>
            <th class="py-2 px-2 border-b">
              Deaths
            </th>
            <th class="py-2 px-2 border-b">
              Assists
            </th>
            <th class="py-2 px-2 border-b">
              KDA
            </th>
            <th class="py-2 px-2 border-b">
              Damage
            </th>
            <th class="py-2 px-2 border-b">
              DPM
            </th>
            <th class="py-2 px-2 border-b">
              Total CS
            </th>
            <th class="py-2 px-2 border-b">
              CSM
            </th>
            <th class="py-2 px-2 border-b">
              Total CSD@14
            </th>
            <th class="py-2 px-2 border-b">
              Avg CSD@14
            </th>
            <th class="py-2 px-2 border-b">
              First Bloods
            </th>
            <th class="py-2 px-2 border-b">
              Solo Bolos
            </th>
          </tr>
        </thead>

        <tbody>




          <tr v-for="player in filteredPlayers" v-bind:key="player.profile.puuid" class="text-center align-middle">
            <td class="py-2 px-2 border-b">{{ player.profile.name }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].gamesPlayed }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].minutesPlayed }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].kills }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].deaths }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].assists }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].kda }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].totalDamageDealtToChampions
              }}</td>
            <td class="py-2 px-2 border-b">{{ Math.round(player.aggregateStats[selectedSeason].damagePerMinute) }}
            </td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].cs }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].csm }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].cs14 }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].cs14 }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].firstBloods }}</td>
            <td class="py-2 px-2 border-b">{{ player.aggregateStats[selectedSeason].soloKills }}</td>
          </tr>



        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import playersData from '../data/playersData.json'
import seasonsData from '../data/seasons.json'

export default {
  name: 'StatsView',
  props: {
    puuid: {
      type: String,
      required: true
    }
  },
  components: {

  },
  setup(props) {
    const players = ref([])
    const matchDetails = ref([])

    const selectedSeason = ref('allTime')
    const seasons = ref(null)


    onMounted(async () => {
      try {
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/players/${props.puuid}`)
        const response = seasonsData
        const pd = playersData
        
        players.value = pd.data
        console.log(players.value)
        seasons.value = response.seasons


      } catch (error) {
        console.error('Error fetching player data:', error)
      }
    })

    const filteredPlayers = computed(() => {
      return players.value.filter(player => player.aggregateStats[selectedSeason.value]);
    });

    return {
      filteredPlayers,
      players,
      matchDetails,
      seasons,
      selectedSeason
    }
  }
}
</script>