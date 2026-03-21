<template>
  <div class="relative" ref="root">
    <!-- Input shows selected name, or typed query -->
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
        v-if="open && filtered.length"
        class="absolute z-30 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-52 overflow-y-auto"
      >
        <li
          v-for="(c, i) in filtered"
          :key="c.id"
          @mousedown.prevent="select(c)"
          @mousemove="highlighted = i"
          class="flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors"
          :class="highlighted === i ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'"
        >
          <img
            :src="`https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${c.id}_0.jpg`"
            :alt="c.name"
            class="w-6 h-6 rounded object-cover flex-shrink-0"
            loading="lazy"
          />
          {{ c.name }}
        </li>
        <li v-if="!filtered.length" class="px-3 py-2 text-sm text-gray-500">No results</li>
      </ul>
    </Transition>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ChampionPicker',
  props: {
    modelValue: { type: String, default: '' },
    champions:  { type: Array, default: () => [] },
    placeholder:{ type: String, default: 'Search champion...' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const root        = ref(null)
    const open        = ref(false)
    const query       = ref('')
    const highlighted = ref(0)

    // What the input displays
    const inputDisplay = computed(() => {
      if (open.value) return query.value
      if (props.modelValue) {
        const match = props.champions.find(c => c.id === props.modelValue)
        return match ? match.name : ''
      }
      return ''
    })

    const filtered = computed(() => {
      const q = query.value.toLowerCase()
      if (!q) return props.champions.slice(0, 80) // show first 80 when no query
      return props.champions.filter(c => c.name.toLowerCase().includes(q)).slice(0, 80)
    })

    const onInput = (e) => {
      query.value = e.target.value
      open.value  = true
      highlighted.value = 0
    }

    const select = (c) => {
      emit('update:modelValue', c.id)
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
      const c = filtered.value[highlighted.value]
      if (c) select(c)
    }

    // Close when clicking outside
    const onClickOutside = (e) => {
      if (root.value && !root.value.contains(e.target)) close()
    }
    onMounted(()   => document.addEventListener('mousedown', onClickOutside))
    onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

    // Reset query when value changes externally (e.g. form reset)
    watch(() => props.modelValue, (val) => {
      if (!val) query.value = ''
    })

    return { root, open, query, highlighted, inputDisplay, filtered, onInput, select, clear, close, moveHighlight, selectHighlighted }
  }
}
</script>

<style scoped>
.dd-enter-active, .dd-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.dd-enter-from, .dd-leave-to       { opacity: 0; transform: translateY(-4px); }
</style>
