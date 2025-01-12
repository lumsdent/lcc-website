<script>
import axios from 'axios'
import StyledRouterLink from './StyledRouterLink.vue'
export default {
  name: 'AppHeader',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  components: {
    StyledRouterLink
  },
  data() {
    return {
      username: '',
      isAdmin: false
    }
  },
  methods: {
    login() {
      window.location.href = import.meta.env.VITE_API_URL + '/auth/discord/login';
    },
    async fetchUser() {
      const response = await axios.get(import.meta.env.VITE_API_URL + '/me/');
      console.log(response.data);

      this.username = this.getCookie('username');
      const admins = await axios.get(import.meta.env.VITE_API_URL + '/players/admins');
      this.isAdmin = admins.data.some(admin => admin.discord.id === response.data.id);
    },
    async logout() {
      window.location.href = import.meta.env.VITE_API_URL + '/logout';
    }
  },
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  },
  mounted() {
    this.fetchUser();
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
    <div v-if="username" class="mt-4 text-xl text-logo-blue">
      Welcome, {{ username }}!
      <button @click="logout" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Logout
      </button>
    </div>
    <div v-else><button @click="login" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Login with Discord
      </button>
    </div>
  </div>
  <nav class="-ml-4 mt-4 py-4 text-left text-base">

    <StyledRouterLink title="Schedule" link="/schedule" />
    <StyledRouterLink v-if="isAdmin" title="Match Input" link="/match" />
    <StyledRouterLink title="Registration" link="/registration" />
    <StyledRouterLink title="Teams" link="/teams" />
    <StyledRouterLink title="Players" link="/players" />
    
    <!-- <StyledRouterLink title="Stats" link="/stats" /> -->
    <!-- <StyledRouterLink title="Draft" link="/draft" /> -->
    <!-- <StyledRouterLink title="Practice" link="/practice" /> -->
    <!-- <StyledRouterLink title="Contact Us" link="/contact" /> -->
  </nav>
</template>
