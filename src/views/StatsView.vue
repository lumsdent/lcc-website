<script>
import axios from 'axios'
export default {
  data() {
    return {
      players: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      await axios
        .get('http://127.0.0.1:5000/player_stats')
        .then((response) => {
          this.players = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<template>
  <div>
    <table class="border-indigo min-w-full border">
      <thead>
        <tr>
          <th
            class="text-logo-blue border-b-logo-blue border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            Player
          </th>
          <th
            class="text-logo-blue border-b-logo-blue border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            Matches Played
          </th>
          <th
            class="text-logo-blue border-b-logo-blue border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            Minutes Played
          </th>
          <th
            class="text-logo-blue border-b-logo-blue border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            Kills
          </th>
          <th
            class="text-logo-blue border-b-logo-blue border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            Deaths
          </th>
          <th
            class="text-logo-blue border-b-logo-blue border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            Assists
          </th>
          <th
            class="text-logo-blue border-b-logo-blue border-b px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
          >
            KDA
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="player in players"
          :key="player.puuid"
          class="border-indigo border hover:bg-slate-400/50"
        >
          <td class="whitespace-nowrap px-6 py-4">{{ player.riotIdGameName }}</td>
          <td class="whitespace-nowrap px-6 py-4">{{ player.matches }}</td>
          <td class="whitespace-nowrap px-6 py-4">{{ player.game_minutes }}</td>
          <td class="whitespace-nowrap px-6 py-4">{{ player.kills }}</td>
          <td class="whitespace-nowrap px-6 py-4">{{ player.deaths }}</td>
          <td class="whitespace-nowrap px-6 py-4">{{ player.assists }}</td>
          <td class="whitespace-nowrap px-6 py-4">{{ player.kda }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
