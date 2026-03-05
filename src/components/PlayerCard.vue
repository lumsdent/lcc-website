<template>
    <div v-if="player" class="card-container">

        <div class="card" :class="{ 'is-flipped': isFlipped }">
            <!-- Front of card -->
            <div class="card-face front">

                <!-- Profile icon -->
                <div class="flex justify-center mb-3">
                    <img :src="`${DDRAGON_URL}${player.profile.images.icon}`" alt="Profile Picture"
                        class="w-20 h-20 rounded-full ring-2 ring-gray-600" />
                </div>

                <!-- Name + level -->
                <div class="text-center mb-3">
                    <h1 class="text-base font-bold text-white leading-tight">{{ player.profile.name }}</h1>
                    <p class="text-gray-500 text-xs mt-0.5">Lv. {{ player.profile.level }}</p>
                </div>

                <!-- Roles -->
                <div class="flex justify-center gap-2 mb-3 min-h-8">
                    <div>
                        <TopSvg class="w-7 h-7" v-if="player.profile.primary_role == 'TOP'" />
                        <JungleSvg class="w-7 h-7" v-if="player.profile.primary_role == 'JUNGLE'" />
                        <MiddleSvg class="w-7 h-7" v-if="player.profile.primary_role == 'MID'" />
                        <BotSvg class="w-7 h-7" v-if="player.profile.primary_role == 'ADC'" />
                        <SupportSvg class="w-7 h-7" v-if="player.profile.primary_role == 'SUPPORT'" />
                        <FlexSvg class="w-7 h-7" v-if="player.profile.primary_role == 'FLEX'" />
                    </div>
                    <div>
                        <TopSvg class="w-7 h-7" v-if="player.profile.secondary_role == 'TOP'" />
                        <JungleSvg class="w-7 h-7" v-if="player.profile.secondary_role == 'JUNGLE'" />
                        <MiddleSvg class="w-7 h-7" v-if="player.profile.secondary_role == 'MID'" />
                        <BotSvg class="w-7 h-7" v-if="player.profile.secondary_role == 'ADC'" />
                        <SupportSvg class="w-7 h-7" v-if="player.profile.secondary_role == 'SUPPORT'" />
                        <FlexSvg class="w-7 h-7" v-if="player.profile.secondary_role == 'FLEX'" />
                    </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-gray-700 mb-3"></div>

                <!-- Most Played -->
                <div class="flex flex-col items-center mb-3">
                    <p class="text-gray-500 text-xs mb-2 uppercase tracking-wide">Most Played</p>
                    <div class="flex gap-1.5">
                        <img v-for="champ in favoriteChampions" :key="champ.name"
                            :src="`${DDRAGON_URL}${champ.image.square}`" :alt="`Champion icon: ${champ.name}`"
                            class="w-8 h-8 rounded-full ring-1 ring-gray-600" />
                    </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-gray-700 mb-3"></div>

                <!-- Availability -->
                <div class="flex flex-col items-center mb-3">
                    <p class="text-gray-500 text-xs mb-2 uppercase tracking-wide">Availability</p>
                    <div v-if="player.profile.availability">
                        <table class="table-auto mx-auto">
                            <thead>
                                <tr>
                                    <th class="text-gray-600 text-xs"></th>
                                    <th v-for="day in days" :key="day" class="px-1.5 py-1 text-gray-500 text-xs font-normal">{{ day.slice(0, 3) }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="px-1.5 py-1 text-gray-500 text-xs">AM</td>
                                    <td v-for="day in days" :key="`${day}-morning`" class="px-1.5 py-1">
                                        <div :class="player.profile.availability[day].morning ? 'bg-blue-500' : 'bg-gray-700'"
                                            class="w-3.5 h-3.5 mx-auto rounded-sm"></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-1.5 py-1 text-gray-500 text-xs">PM</td>
                                    <td v-for="day in days" :key="`${day}-evening`" class="px-1.5 py-1">
                                        <div :class="player.profile.availability[day].evening ? 'bg-blue-500' : 'bg-gray-700'"
                                            class="w-3.5 h-3.5 mx-auto rounded-sm"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p class="text-gray-600 text-xs italic">No availability set</p>
                    </div>
                </div>

                <!-- Action buttons -->
                <div class="flex justify-center gap-2 mt-auto pt-2 border-t border-gray-700">
                    <a :href="`https://www.op.gg/summoners/na/${player.profile.name}-${player.profile.tag}`"
                        target="_blank"
                        class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors">
                        OP.GG
                    </a>
                    <button @click="flipCard"
                        class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors">
                        Bio
                    </button>
                    <router-link :to="`/players/${player.profile.puuid}`"
                        class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-colors">
                        Profile
                    </router-link>
                </div>
            </div>

            <!-- Back of card -->
            <div class="card-face back flex flex-col items-center">
                <p class="text-gray-500 text-xs uppercase tracking-wide mb-3">About</p>
                <div class="flex-1 w-full overflow-y-auto">
                    <p v-if="player.profile.bio" class="text-gray-300 text-sm leading-relaxed">{{ player.profile.bio }}</p>
                    <p v-else class="text-gray-600 text-sm italic">This player has not added a bio yet.</p>
                </div>
                <button @click="flipCard"
                    class="mt-4 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors">
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
    height: 460px;
    position: relative;
    width: 100%;
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
    height: 100%;
    backface-visibility: hidden;
    background-color: rgb(31 41 55); /* bg-gray-800 */
    border: 1px solid rgb(55 65 81);  /* border-gray-700 */
    border-radius: 0.75rem;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: border-color 0.2s;
}

.card-face:hover {
    border-color: rgb(107 114 128); /* gray-500 */
}

.back {
    transform: rotateY(-180deg);
}
</style>