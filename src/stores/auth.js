import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { DDRAGON_URL } from '@/config.js'

const API = () => import.meta.env.VITE_API_URL

function resolveIcon(icon) {
  if (!icon) return null
  return icon.startsWith('http') ? icon : DDRAGON_URL + icon
}

export const useAuthStore = defineStore('auth', () => {
  const player  = ref(null)   // full /me/ response
  const loading = ref(true)

  const isLoggedIn = computed(() => !!player.value)
  const isAdmin    = computed(() => !!player.value?.is_admin)

  // Display name: prefer profile.name, fall back to discord username
  const displayName = computed(() =>
    player.value?.profile?.name || player.value?.discord?.username || ''
  )

  // Profile icon URL — discord avatar takes priority so the user sees themselves
  const avatarUrl = computed(() =>
    player.value?.discord?.avatar_url ||
    resolveIcon(player.value?.profile?.images?.icon) ||
    ''
  )

  const puuid = computed(() => player.value?.profile?.puuid || null)

  async function fetchMe() {
    loading.value = true
    try {
      const { data } = await axios.get(API() + '/me/')
      player.value = data
    } catch {
      player.value = null
    } finally {
      loading.value = false
    }
  }

  function login() {
    window.location.href = API() + '/auth/discord/login/'
  }

  function logout() {
    window.location.href = API() + '/logout/'
  }

  return { player, loading, isLoggedIn, isAdmin, displayName, avatarUrl, puuid, fetchMe, login, logout }
})
