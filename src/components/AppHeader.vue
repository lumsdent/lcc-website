<script>
import axios from 'axios'
export default {
  name: 'AppHeader',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.get('http://localhost:5000/auth/discord/login');
        
        console.log(response.data);
      } catch (error) {
        console.error('Error during login:', error);
      }
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
    <button @click="login" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
      Login with Discord
    </button>
  </div>
</template>
