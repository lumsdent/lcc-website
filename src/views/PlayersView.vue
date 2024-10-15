<template>
    <div>
        <div v-for="player in players" :key="player.userName">
           </div>
    </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'


export default {
    name: 'PlayersView',
    components: {
        
    },
    setup() {
        const players = ref([])
        
        

        onMounted(async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + "/players")
                console.log(response.data)
                players.value = response.data
                
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