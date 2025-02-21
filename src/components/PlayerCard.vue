<template>
    <div v-if="player" class="card-container">

        <div class="card" :class="{ 'is-flipped': isFlipped }">
            <!-- Front of card -->
            <div class="card-face front">
                <div class="grid grid-cols-2 gap-4">
                    <!-- Left Column - Profile Icon -->
                    <div class="flex justify-center items-center">
                        <img :src="`${DDRAGON_URL}${player.profile.images.icon}`" alt="Profile Picture"
                            class="w-28 h-28 rounded-full" />
                    </div>

                    <!-- Right Column - Player Info -->
                    <div class="flex flex-col items-center border-l border-gray-300">
                        <h1 class="text-base text-logo-red">{{ player.profile.name }}</h1>
                        <p class="text-gray-400">{{ player.profile.level }}</p>

                        <div class="flex mt-4 space-x-2 min-h-8">
                            <div>
                                <TopSvg class="w-8 h-8" v-if="player.profile.primary_role == 'TOP'" />
                                <JungleSvg class="w-8 h-8" v-if="player.profile.primary_role == 'JUNGLE'" />
                                <MiddleSvg class="w-8 h-8" v-if="player.profile.primary_role == 'MID'" />
                                <BotSvg class="w-8 h-8" v-if="player.profile.primary_role == 'ADC'" />
                                <SupportSvg class="w-8 h-8" v-if="player.profile.primary_role == 'SUPPORT'" />
                                <FlexSvg class="w-8 h-8" v-if="player.profile.primary_role == 'FLEX'" />
                            </div>
                            <div>
                                <TopSvg class="w-8 h-8" v-if="player.profile.secondary_role == 'TOP'" />
                                <JungleSvg class="w-8 h-8" v-if="player.profile.secondary_role == 'JUNGLE'" />
                                <MiddleSvg class="w-8 h-8" v-if="player.profile.secondary_role == 'MID'" />
                                <BotSvg class="w-8 h-8" v-if="player.profile.secondary_role == 'ADC'" />
                                <SupportSvg class="w-8 h-8" v-if="player.profile.secondary_role == 'SUPPORT'" />
                                <FlexSvg class="w-8 h-8" v-if="player.profile.secondary_role == 'FLEX'" />
                            </div>
                        </div>

                        <h2 class="mt-4 mb-2 text-logo-blue">Most Played</h2>
                        <div class="flex mt-2 space-x-2">
                            <img v-for="champ in favoriteChampions" :key="champ.name"
                                :src="`${DDRAGON_URL}${champ.image.square}`" :alt="`Champion icon: ${champ.name}`"
                                class="w-8 h-8 rounded-full" />
                        </div>
                    </div>
                </div>
                <div class = "flex flex-col items-center">

                    <h2 class="mt-4 mb-2 t text-logo-blue">Availability</h2>
                    <div v-if="player.profile.availability">
                        
                        <table class="table-auto mx-auto">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th v-for="day in days" :key="day" class="px-2 py-2">{{ day.slice(0, 3) }}</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td class="px-2 py-2">AM</td>
                                <td v-for="day in days" :key="`${day}-morning`" class="px-2 py-2">
                                    <div :class="{ 'bg-logo-blue': player.profile.availability[day].morning, 'bg-gray-200': !player.profile.availability[day].morning }"
                                    class="w-4 h-4 mx-auto rounded"></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-2 py-2">PM</td>
                                <td v-for="day in days" :key="`${day}-evening`" class="px-2 py-2">
                                    <div :class="{ 'bg-logo-blue': player.profile.availability[day].evening, 'bg-gray-200': !player.profile.availability[day].evening }"
                                    class="w-4 h-4 mx-auto rounded"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    <p class="mt-4 text-gray-400 h-28">This player has not set their availability</p>
                </div>
            </div>
                <div class="flex justify-center space-x-4 mt-4">
                    <a :href="`https://www.op.gg/summoners/na/${player.profile.name}`" target="_blank"
                        class="px-4 py-2 bg-logo-blue text-white rounded hover:bg-blue-500 transition-colors">
                        OP.GG
                    </a>

                    <button @click="flipCard"
                        class="px-4 py-2 bg-logo-blue text-white rounded hover:bg-blue-500 transition-colors">
                        Bio
                    </button>

                    <router-link :to="`/players/${player.profile.puuid}`"
                        class="px-4 py-2 bg-logo-blue text-white rounded hover:bg-blue-500 transition-colors">
                        Stats
                    </router-link>
                </div>
            </div>
            <!-- Back of card -->
            <div class="card-face back flex flex-col items-center">
                <h2 class="text-med text-logo-blue mb-4">About</h2>
                <div class="min-h-80  flex justify-center">
                    <p v-if="player.profile.bio" class="text-gray-400">{{ player.profile.bio }}</p>
                    <p v-else class="text-gray-400">This player has played before but has not registered for the current
                        season</p>
                </div>
                <button @click="flipCard"
                    class="px-4 py-2  bg-logo-blue text-white rounded hover:bg-blue-500 transition-colors">
                    Player Info
                </button>
            </div>
        </div>

    </div>
</template>

<script>
import { DDRAGON_URL } from '@/config.js';
import BotSvg from '@/components/lanes/BotSvg.vue'
import TopSvg from '@/components/lanes/TopSvg.vue'
import SupportSvg from '@/components/lanes/SupportSvg.vue'
import MiddleSvg from '@/components/lanes/MiddleSvg.vue'
import JungleSvg from '@/components/lanes/JungleSvg.vue'
import FlexSvg from '@/components/lanes/FlexSvg.vue';
import {ref} from 'vue'

export default {
    name: 'PlayerCard',
    props: {
        player: {
            type: [Object,null],
            required: true
        }
    },
    components: {
        BotSvg,
        TopSvg,
        SupportSvg,
        MiddleSvg,
        JungleSvg,
        FlexSvg

    },
    setup(){
        const isFlipped = ref(false)
        const flipCard = () => {
            isFlipped.value = !isFlipped.value

    }
    return {
        isFlipped,
        flipCard
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
            
        },
        days() {
            return ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday", "Sunday"];
        }
    },
    data() {
        return {
            DDRAGON_URL,
        }
    }

}
</script>

<style scoped>
.card-container {
    perspective: 1000px;
    /* min-height: 300px; */
    height: 440px;
    position: relative;
    width: 100%;
    border: white
}

.card {
    position: relative;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    height: 100%;
    width: 100%;
    transform-origin: center;
}

.card.is-flipped {
    transform: rotateY(-180deg);
}

.card-face {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    backface-visibility: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    
}

.back {
    transform: rotateY(-180deg);
}
</style>