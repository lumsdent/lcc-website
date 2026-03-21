<template>
  <div class="relative" ref="root">
    <button
      @click="open = !open"
      class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 hover:border-gray-500 transition-colors text-sm text-white"
    >
      <!-- Avatar -->
      <img v-if="authStore.avatarUrl" :src="authStore.avatarUrl" :alt="authStore.displayName"
        class="w-6 h-6 rounded-full object-cover" />
      <div v-else class="w-6 h-6 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold">
        {{ authStore.displayName.charAt(0).toUpperCase() }}
      </div>
      <span class="max-w-[120px] truncate">{{ authStore.displayName }}</span>
      <!-- Admin badge -->
      <span v-if="authStore.isAdmin"
        class="text-xs font-bold px-1.5 py-0.5 rounded bg-yellow-600 text-yellow-100 leading-none">
        Admin
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition name="dd">
      <div v-if="open"
        class="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
        <div class="px-3 py-2.5 border-b border-gray-800">
          <p class="text-xs font-semibold text-white truncate">{{ authStore.displayName }}</p>
          <p v-if="authStore.player?.discord?.username" class="text-xs text-gray-500 truncate">
            @{{ authStore.player.discord.username }}
          </p>
        </div>
        <RouterLink to="/dashboard" @click="open = false"
          class="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/tournament" @click="open = false"
          class="flex items-center gap-2 px-3 py-2.5 text-sm text-yellow-400 hover:bg-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Tournament Manager
        </RouterLink>
        <button @click="authStore.logout()"
          class="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-gray-800 transition-colors border-t border-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ProfileButton',
  setup() {
    const authStore = useAuthStore()
    const open = ref(false)
    const root = ref(null)

    const onClickOutside = (e) => {
      if (root.value && !root.value.contains(e.target)) open.value = false
    }
    onMounted(()   => document.addEventListener('mousedown', onClickOutside))
    onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

    return { authStore, open, root }
  }
}
</script>

<style scoped>
.dd-enter-active, .dd-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.dd-enter-from, .dd-leave-to       { opacity: 0; transform: translateY(-4px); }
</style>
