<script>
export default {
  name: 'AppHeader',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
  <div>
    <h1 class="relative mt-10 text-4xl font-medium text-logo-blue">{{ message }}</h1>
    <h3 class="text-xl">
      LCC Season 2 is live on
      <a href="https://www.twitch.tv/jagshockey" target="_blank" rel="noopener">Twitch</a>
      and vods are available on
      <a href="https://www.youtube.com/@LCCS2" target="_blank" rel="noopener">Youtube</a>. Thanks
      for watching!
    </h3>
  </div>
</template>
