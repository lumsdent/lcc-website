<template>
    <div v-if="champion" class="relative">
        <img class="w-12 h-12 rounded-full"
            :src="`${champion.image.square}`"
            :alt="champion.name" />
        <div
            class="bg-gray-800 text-xs flex items-center justify-center w-5 h-5 rounded-full p-1 absolute -bottom-1 -left-1">
            {{ champion.level }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChampionIcon',
    props: {
        champion: {
            type: [Object, null],
            required: true
        }
    }

}
</script>