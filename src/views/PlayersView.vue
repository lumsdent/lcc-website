<template>
    <div>
        <div class="mb-4">
            <label class="inline-flex items-center">
                <input type="checkbox" v-model="showActiveOnly" class="form-checkbox" />
                <span class="ml-2">Show Active Players Only</span>
            </label>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RouterLink v-for="player in filteredPlayers" :key="player.profile.puuid" :to="`players/${player.profile.puuid}`"
                class="block">
                <PlayerCard :player="player" />
            </RouterLink>
        </div>
    </div>
</template>

<script>
import PlayerCard from '@/components/PlayerCard.vue';
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router';

export default {
    name: 'PlayersView',
    components: {
        PlayerCard,
        RouterLink
    },
    setup() {
        const players = ref([])
        const showActiveOnly = ref(false)
        

        onMounted(async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + "/players")
                console.log(response.data)
                players.value = response.data
            
            } catch (error) {
                console.error('Error fetching player data:', error)
            }
        })

        const filteredPlayers = computed(() => {
            return showActiveOnly.value
                ? players.value.filter(player => player.profile.is_active)
                : players.value
        })

        return {
            players,
            showActiveOnly,
            filteredPlayers
        }
    }
}
</script>