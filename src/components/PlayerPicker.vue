<template>
  <div class="relative" ref="root">
    <div class="relative">
      <input
        type="text"
        :placeholder="placeholder"
        :value="inputDisplay"
        @input="onInput"
        @focus="open = true"
        @keydown.down.prevent="moveHighlight(1)"
        @keydown.up.prevent="moveHighlight(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="close"
        autocomplete="off"
        class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        :class="{ 'border-blue-500': open }"
      />
      <!-- Clear button -->
      <button
        v-if="modelValue"
        type="button"
        @click.stop="clear"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
      >&times;</button>
      <svg v-else xmlns="http://www.w3.org/2000/svg"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Dropdown -->
    <Transition name="dd">
      <ul
        v-if="open && (filtered.length || loading)"
        class="absolute z-30 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-52 overflow-y-auto"
      >
        <li v-if="loading" class="px-3 py-2 text-sm text-gray-500">Loading players...</li>
        <template v-else>
          <li
            v-for="(p, i) in filtered"
            :key="p.puuid"
            @mousedown.prevent="select(p)"
            @mousemove="highlighted = i"
            class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors"
            :class="highlighted === i ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'"
          >
            <!-- Avatar -->
            <img
              v-if="p.iconUrl"
              :src="p.iconUrl"
              :alt="p.name"
              class="w-6 h-6 rounded-full object-cover flex-shrink-0"
              loading="lazy"
            />
            <div v-else class="w-6 h-6 rounded-full bg-gray-700 flex-shrink-0" />

            <span class="flex-1 font-medium">{{ p.name }}</span>
            <span v-if="p.role" class="text-xs opacity-60">{{ p.role }}</span>
          </li>
          <li v-if="!filtered.length" class="px-3 py-2 text-sm text-gray-500">No results</li>
        </template>
      </ul>
    </Transition>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export default {
  name: 'PlayerPicker',
  props: {
    modelValue:  { type: String, default: '' },
    placeholder: { type: String, default: 'Search player...' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const root        = ref(null)
    const open        = ref(false)
    const query       = ref('')
    const highlighted = ref(0)
    const loading     = ref(false)
    const players     = ref([])  // [{ name, puuid, iconUrl, role }]
    const ddVersion   = ref('latest')

    // What the input displays
    const inputDisplay = computed(() => {
      if (open.value) return query.value
      return props.modelValue || ''
    })

    const filtered = computed(() => {
      const q = query.value.toLowerCase().trim()
      if (!q) return players.value
      return players.value.filter(p => p.name.toLowerCase().includes(q))
    })

    const onInput = (e) => {
      query.value = e.target.value
      open.value  = true
      highlighted.value = 0
    }

    const select = (p) => {
      emit('update:modelValue', p.name)
      query.value = ''
      open.value  = false
    }

    const clear = () => {
      emit('update:modelValue', '')
      query.value = ''
      open.value  = false
    }

    const close = () => {
      query.value = ''
      open.value  = false
    }

    const moveHighlight = (dir) => {
      const max = filtered.value.length - 1
      highlighted.value = Math.max(0, Math.min(max, highlighted.value + dir))
    }

    const selectHighlighted = () => {
      const p = filtered.value[highlighted.value]
      if (p) select(p)
    }

    // Close on outside click
    const onClickOutside = (e) => {
      if (root.value && !root.value.contains(e.target)) close()
    }
    onMounted(() => document.addEventListener('mousedown', onClickOutside))
    onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

    // Reset query when value cleared externally
    watch(() => props.modelValue, (val) => {
      if (!val) query.value = ''
    })

    // Fetch player list on mount
    onMounted(async () => {
      // Resolve latest DDragon version first so icon URLs are correct
      try {
        const { data } = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json', { withCredentials: false })
        ddVersion.value = data[0]
      } catch { /* keep 'latest' as fallback */ }

      loading.value = true
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/players', { withCredentials: false })
        players.value = data
          .filter(p => p.profile?.name && p.profile?.is_active !== false)
          .map(p => {
            const rawIcon = p.profile.images?.icon || ''
            let iconUrl = ''
            if (rawIcon) {
              if (rawIcon.startsWith('http')) {
                iconUrl = rawIcon
              } else {
                // rawIcon is like /img/profileicon/123.png — needs CDN version prefix
                iconUrl = `https://ddragon.leagueoflegends.com/cdn/${ddVersion.value}${rawIcon}`
              }
            }
            return {
              name:    p.profile.name,
              puuid:   p.profile.puuid || p.profile.name,
              iconUrl,
              role:    p.profile.primary_role || '',
            }
          })
          .sort((a, b) => a.name.localeCompare(b.name))
      } catch (err) {
        console.error('PlayerPicker: failed to load players', err)
      } finally {
        loading.value = false
      }
    })

    return {
      root, open, query, highlighted, loading, players,
      inputDisplay, filtered,
      onInput, select, clear, close, moveHighlight, selectHighlighted,
    }
  }
}
</script>

<style scoped>
.dd-enter-active, .dd-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.dd-enter-from, .dd-leave-to       { opacity: 0; transform: translateY(-4px); }
</style>
