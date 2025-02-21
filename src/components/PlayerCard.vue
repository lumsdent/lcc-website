<template>

    <div v-if="player" class="border border-gray-300 rounded-lg p-4 text-center max-h-fit justify-center min-w-fit">
        <div class = "flex justify-center ">
            <img :src="`${DDRAGON_URL}${player.profile.images.icon}`" alt="Profile Picture"
            class="w-48 h-48 rounded-full " />
        </div>
        <h2 class="mt-4 mb-2 text-2xl text-logo-red">{{ player.profile.name }}</h2>
        <p class="text-gray-400">{{ player.profile.level }}</p>
        <div class="flex justify-center mt-4 space-x-2 min-h-8">
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
        <!-- <h3 class="mt-4 mb-2 text-l">Current Team</h3>
        <div v-if="player.teams">
            <p class="mt-4">{{ Object.values(player.teams[player.teams.length - 1])[0].name }}</p>
        </div>
        <div v-else>
            <p class="mt-4">New Player</p>
        </div> -->
        <h3 class="mt-4 mb-2 text-lg text-logo-blue">Most Played</h3>
        <div class="flex justify-center mt-4 space-x-2">
            <img v-for="champ in favoriteChampions" :key="champ.name" :src="`${DDRAGON_URL}${champ.image.square}`"
                :alt="`Champion icon: ${champ.name}`" class="w-12 h-12 rounded-full" />
        </div>
        <h3 class="mt-4 mb-2 text-lg text-logo-blue">About</h3>
        <div class="min-h-48 flex  justify-center">
            <p v-if="player.profile.bio" class="mt-4 text-gray-400">{{ player.profile.bio }}</p>
            <p v-else class="mt-4 text-gray-400">This player has played before but has not registered for the current season</p>
        </div>
        <h3 class="mt-4 mb-2 text-lg text-logo-blue">Availability</h3>
        <div v-if="player.profile.availability">
            
            <table class="table-auto mx-auto">
                <thead>
                    <tr>
                        <th></th>
                        <th v-for="day in days" :key="day" class="px-2 py-2">{{ day.slice(0,3) }}</th>
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
        <a :href="`https://www.op.gg/summoners/na/${player.profile.name}-${player.profile.tag}`" target="_blank"
        rel="noopener noreferrer" class="block mt-4 text-blue-500" @click.stop>OP.GG</a>
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
            DDRAGON_URL
        }
    }

}
</script>