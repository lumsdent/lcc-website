<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="blue">{{ msg }}</h1>
    <h3>
      LCC Season 2 is live on
      <a href="https://www.twitch.tv/jagshockey" target="_blank" rel="noopener">Twitch</a>
      and vods are available on
      <a href="https://www.youtube.com/@LCCS2" target="_blank" rel="noopener">Youtube</a>. Thanks
      for watching!
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
