<template>
    <div>
        <h1>Match Detail</h1>
        <p>Match ID: {{ matchId }}</p>
        <!-- Add more match detail content here -->
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
    name: 'MatchDetail',
    setup() {
        const route = useRoute()
        const matchId = ref(route.params.matchId)

        onMounted(() => {
            // Fetch match details using matchId
        })

        return {
            matchId
        }
    }
}
</script>