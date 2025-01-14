<script>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    RouterView,
    
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="flex max-h-screen place-items-center leading-6">
      <img alt="LCC logo" class="mr-8" src="@/assets/logo.svg" width="125" height="125" />
      <div class="flex flex-wrap place-items-start">
        <AppHeader message="Welcome to the LCC!" />
      </div>
    </header>
    <main class="flex-grow">
      <RouterView />
    </main>
    <footer class="bg-gray-800 text-white py-4 justify-center items-center flex flex-col">
      <div class="flex space-x-4">
        <a href="https://discord.gg/bdn4A7FmdW" target="_blank" rel="noopener noreferrer">
          <svg class="w-6 h-6 text-white hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1066c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
          </svg>
        </a>
        <a href="https://www.twitch.tv/jagshockey" target="_blank" rel="noopener noreferrer">
          <svg class="w-6 h-6 text-white hover:text-purple-500" fill="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.5 0L0 4v17.5h5V24h4l2.5-2.5h5L24 12V0H2.5zM22 11.5l-4.5 4.5h-5L10 19v-3.5H5V2h17v9.5zM17.5 6h-2v5h2V6zm-5 0h-2v5h2V6z" />
          </svg>
        </a>
        <a href="https://www.youtube.com/@LCCS2" target="_blank" rel="noopener noreferrer">
          <svg class="w-6 h-6 text-white hover:text-red-500" fill="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23.498 6.186a2.999 2.999 0 0 0-2.118-2.118C19.622 3.5 12 3.5 12 3.5s-7.622 0-9.38.568A2.999 2.999 0 0 0 .502 6.186C0 7.944 0 12 0 12s0 4.056.502 5.814a2.999 2.999 0 0 0 2.118 2.118C4.378 20.5 12 20.5 12 20.5s7.622 0 9.38-.568a2.999 2.999 0 0 0 2.118-2.118C24 16.056 24 12 24 12s0-4.056-.502-5.814zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
          </svg>
        </a>
      </div>
      <RouterLink to="/match" class="mt-4 text-blue-500 hover:text-blue-700">Admin</RouterLink>
      <div>(alpha 0.0.0)</div>
    </footer>
  </div>
</template>
