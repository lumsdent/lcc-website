<template>

    <div v-if="player"
        class="border border-gray-300 max-w-sm rounded-lg p-4 text-center max-h-fit justify-center min-w-fit">
        <img :src="player.profile.images.icon" alt="Profile Picture" class="w-full h-auto rounded-full" />
        <h2 class="mt-4 mb-2 text-xl">{{ player.profile.name }}</h2>
        <p class="text-gray-600">{{ player.profile.level }}</p>
        <h3 class="mt-4 mb-2 text-l">Current Team</h3>
        <div v-if="player.teams">
            <p class="mt-4">{{ Object.values(player.teams[player.teams.length - 1])[0].name }}</p>
        </div>
        <div v-else>
            <p class="mt-4">New Player</p>
        </div>
        <div class="flex justify-center mt-4 space-x-2">
            <img v-for="champ in favoriteChampions" :key="champ.name" :src="champ.image.square"
                :alt="`Champion icon: ${champ.name}`" class="w-12 h-12 rounded-full" />
        </div>
        <p class="mt-4">{{ player.profile.bio }}</p>
        <a :href="`https://www.op.gg/summoners/na/${player.profile.name}-${player.profile.tag}`" target="_blank"
            rel="noopener noreferrer" class="block mt-4 text-blue-500" @click.stop>OP.GG</a>
    </div>
</template>

<script>
export default {
    name: 'PlayerCard',
    props: {
        player: {
            type: [Object,null],
            required: true
        }
    },  
    computed: {
        favoriteChampions() {
            if(this.player.championStats) {
                const champs = this.player.championStats["allTime"]
                return champs.sort((a, b) => b.gamesPlayed - a.gamesPlayed).slice(0, 3);
            }else {
                return this.player.champion_mastery
            }
            
        }
    }

}
</script>