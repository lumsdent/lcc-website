<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <RouterLink v-for="player in players" :key="player.profile.puuid"
            :to="`players/${player.profile.puuid}`" class="block">
            <PlayerCard :player="player" />
        </RouterLink>
    </div>
</template>

<script>
import PlayerCard from '@/components/PlayerCard.vue';
import axios from 'axios'
import { ref, onMounted } from 'vue'
import playerData from '../data/playerData.json'
import { RouterLink } from 'vue-router';

export default {
    name: 'PlayersView',
    components: {
        PlayerCard,
        RouterLink
    },
    setup() {
        const players = ref([])
        
        

        onMounted(async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + "/players")
                console.log(response.data)
                players.value = response.data
                // const response = playerData
                // const playerArray = []
                // playerArray.push(response.data)
                // playerArray.push(response.data)
                // playerArray.push(response.data)
                // playerArray.push(response.data)
                // playerArray.push(response.data)
                // playerArray.push(response.data)
                // playerArray.push(response.data)
                // playerArray.push(response.data)
                // playerArray.push(response.data)
                // playerArray.push(response.data)
                // playerArray.push(response.data)

                // players.value = playerArray
            } catch (error) {
                console.error('Error fetching player data:', error)
            }
        })

        return {
            players
        }
    }
}
</script>