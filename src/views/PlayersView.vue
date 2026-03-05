<template>
    <div class="p-6 max-w-7xl mx-auto">

        <!-- Header -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-white mb-2">Players</h1>
            <p class="text-gray-400">{{ filteredPlayers.length }} player{{ filteredPlayers.length !== 1 ? 's' : '' }}</p>
        </div>

        <!-- Filters -->
        <div class="mb-8 flex flex-col items-center gap-4">

            <!-- Search + active toggle -->
            <div class="flex flex-wrap justify-center items-center gap-3">
                <input
                    v-model="nameSearch"
                    type="text"
                    placeholder="Search by name…"
                    class="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-56"
                />
                <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" v-model="showActiveOnly" class="form-checkbox accent-blue-500" />
                    <span class="text-gray-300 text-sm">Active players only</span>
                </label>
            </div>

            <!-- Role filter pills -->
            <div class="flex flex-wrap justify-center gap-2">
                <button
                    @click="roleFilter = null"
                    :class="roleFilter === null
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
                    class="px-4 py-1.5 rounded-full border text-sm font-medium transition-colors"
                >
                    All Roles
                </button>
                <button
                    v-for="role in roles"
                    :key="role"
                    @click="roleFilter = roleFilter === role ? null : role"
                    :class="roleFilter === role
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'"
                    class="px-4 py-1.5 rounded-full border text-sm font-medium transition-colors"
                >
                    {{ role }}
                </button>
            </div>
        </div>

        <!-- Player Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="player in filteredPlayers" :key="player.profile.puuid" class="block">
                <PlayerCard :player="player" />
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredPlayers.length === 0" class="text-center py-16 text-gray-500">
            No players match your filters.
        </div>

    </div>
</template>

<script>
import PlayerCard from '@/components/PlayerCard.vue';
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'

export default {
    name: 'PlayersView',
    components: {
        PlayerCard
    },
    setup() {
        const players = ref([])
        const showActiveOnly = ref(true)
        const nameSearch = ref('')
        const roleFilter = ref(null)
        const roles = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT', 'FLEX']

        onMounted(async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + "/players")
                players.value = response.data
            } catch (error) {
                console.error('Error fetching player data:', error)
            }
        })

        const filteredPlayers = computed(() => {
            const search = nameSearch.value.trim().toLowerCase()
            return players.value.filter(player => {
                if (showActiveOnly.value && !player.profile.is_active) return false
                if (search && !player.profile.name.toLowerCase().includes(search)) return false
                if (roleFilter.value) {
                    const primary = player.profile.primary_role
                    const secondary = player.profile.secondary_role
                    if (primary !== roleFilter.value && secondary !== roleFilter.value) return false
                }
                return true
            })
        })

        return {
            players,
            showActiveOnly,
            nameSearch,
            roleFilter,
            roles,
            filteredPlayers
        }
    }
}
</script>