<script>
import announcement from '@/data/announcement.json'
import flag1 from '@/assets/flags/Season_1_Champions_Banner.png'
import flag2 from '@/assets/flags/Season_2_Champions_Banner.png'
import flag3 from '@/assets/flags/Season_3_Champions_Banner.png'
export default {
  name: 'AppHeader',
  data() {
    return {
      announcement,
      flags: [
        { src: flag1, alt: 'Season 1 Champions Banner' },
        { src: flag2, alt: 'Season 2 Champions Banner' },
        { src: flag3, alt: 'Season 3 Champions Banner' },
      ],
      navLinks: [
        { title: 'Home', path: '/' },
        { title: 'Schedule', path: '/schedule' },
        { title: 'Registration', path: '/registration' },
        { title: 'Teams', path: '/teams' },
        { title: 'Players', path: '/players' },
        { title: 'Matches', path: '/matches' },
        { title: 'Stats', path: '/stats' },
        // { title: 'Practice', path: '/practice' },
        { title: 'Art', path: '/art' },
      ]
    }
  }
}
</script>

<template>
  <div class="w-full">

    <!-- Branding row -->
    <div class="flex items-stretch justify-between pt-0 pb-5 border-b border-gray-800">
      <RouterLink to="/" class="flex items-center gap-5 hover:!bg-transparent">
        <img src="@/assets/logo.svg" alt="LCC logo" width="96" height="96" />
        <div>
          <h1 class="text-3xl font-bold text-white tracking-wide leading-tight">
            League <span class="text-logo-blue">Community</span> Cup
          </h1>
          <p class="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Amateur League of Legends &middot; Est. 2022 &middot; Season 4</p>
        </div>
      </RouterLink>

      <!-- Championship banners -->
      <div class="flex items-start gap-3 self-stretch pointer-events-none select-none">
        <div v-for="(flag, i) in flags" :key="i">
          <img :src="flag.src" :alt="flag.alt" class="w-auto h-32 object-contain drop-shadow-lg opacity-80 hover:opacity-100 transition-opacity pointer-events-auto" />
        </div>
      </div>

      <div class="flex items-center gap-3 self-center flex-shrink-0">
        <a href="https://www.twitch.tv/jagshockey" target="_blank" rel="noopener" class="hidden sm:flex items-center gap-2 rounded-full bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-logo-blue transition-colors">
          <span class="w-2 h-2 rounded-full bg-logo-blue animate-pulse"></span>
          <span>Season 4 <span class="text-logo-blue font-semibold">Live</span></span>
        </a>
        <!-- Auth temporarily disabled
        <LoginButton v-if="!authStore.loading && !authStore.isLoggedIn" />
        <ProfileButton v-else-if="authStore.isLoggedIn" />
        -->
      </div>
    </div>

    <!-- Announcement strip -->
    <div class="flex items-start gap-2.5 py-2.5 border-b border-gray-800 text-sm text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 text-logo-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M3 8a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
      </svg>
      <span>
        <template v-for="(part, i) in announcement.parts" :key="i">
          <a v-if="part.href" :href="part.href" target="_blank" rel="noopener" class="text-logo-blue hover:underline">{{ part.text }}</a>
          <template v-else>{{ part.text }}</template>
        </template>
      </span>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-wrap gap-1 py-3">
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border border-transparent"
        active-class="!text-white !bg-gray-800 !border-gray-700"
      >{{ link.title }}</RouterLink>
    </nav>

  </div>
</template>
