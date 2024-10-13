<template>
    <div>
        <div v-for="player in players" :key="player.userName">
            <ProfileCard
                :profilePicture="`https://ddragon.leagueoflegends.com/cdn/14.19.1/img/profileicon/${player.profileIconId}.png`"
                :title="player.userName" :description="player.summonerLevel" :matches="player.matches" />
            <p>{{ player.teams }}</p>
            <a :href="`https://www.op.gg/summoners/na/${player.userName}-${player.userTag}`" target="_blank"
                rel="noopener noreferrer">
                OP.GG
            </a>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import ProfileCard from './ProfileCard.vue'

export default {
    name: 'PlayersView',
    components: {
        ProfileCard
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