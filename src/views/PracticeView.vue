<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">

    <!-- Page header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white mb-1">Practice Log</h1>
      <p class="text-gray-400 text-sm">Track your solo queue sessions and review your improvement over time.</p>
    </div>

    <ResponseBox v-if="responseMessage" :message="responseMessage" :isSuccess="isSuccess" class="mb-6" />

    <!-- Three-column layout: splash | form | splash -->
    <div class="flex gap-6 items-start">

      <!-- Left splash -->
      <div class="hidden lg:block w-44 flex-shrink-0">
        <Transition name="fade">
          <img v-if="myChampionSplash" :src="myChampionSplash" :alt="preMatch.myChampion"
            class="w-full rounded-xl shadow-lg object-cover" />
        </Transition>
      </div>

      <!-- Form card -->
      <div class="flex-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">

        <!-- Step indicator -->
        <div class="flex">
          <div class="flex-1 py-3 text-center text-sm font-semibold transition-colors"
            :class="!preMatchFormSubmitted ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'">
            1 - Pre-Match
          </div>
          <div class="flex-1 py-3 text-center text-sm font-semibold transition-colors"
            :class="preMatchFormSubmitted ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'">
            2 - Post-Match
          </div>
        </div>

        <div class="p-6">
          <!-- PRE-MATCH FORM -->
          <form v-if="!preMatchFormSubmitted" @submit.prevent="submitPrematchForm" class="space-y-5">

            <!-- Player -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Player</label>
              <PlayerPicker v-model="preMatch.playerName" placeholder="Search player..." />
            </div>

            <!-- Queue type -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Queue Type</label>
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <label v-for="q in queueTypes" :key="q.value"
                  class="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors"
                  :class="preMatch.gameMode === q.value
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-500'">
                  <input type="radio" :value="q.value" v-model="preMatch.gameMode" class="hidden" />
                  {{ q.label }}
                </label>
              </div>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <div class="flex gap-2">
                <label v-for="r in roles" :key="r.value"
                  class="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border text-xs cursor-pointer transition-colors"
                  :class="preMatch.role === r.value
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-500'">
                  <input type="radio" :value="r.value" v-model="preMatch.role" class="hidden" />
                  <component :is="r.icon" class="w-5 h-5" />
                  {{ r.label }}
                </label>
              </div>
            </div>

            <!-- Champions -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Your Champion</label>
                <ChampionPicker v-model="preMatch.myChampion" :champions="champions" placeholder="Search champion..." />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Lane Opponent</label>
                <ChampionPicker v-model="preMatch.opponentChampion" :champions="champions" placeholder="Search champion..." />
              </div>
            </div>

            <!-- Goal -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Practice Goal</label>
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <label v-for="g in goals" :key="g.label"
                  class="flex flex-col items-center justify-center gap-1 px-2 py-2.5 h-16 rounded-lg border text-xs cursor-pointer transition-colors"
                  :class="preMatch.goal === g.label
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-500'">
                  <input type="radio" :value="g.label" v-model="preMatch.goal" class="hidden" />
                  <span class="text-base leading-none">{{ g.icon }}</span>
                  <span class="text-center leading-tight">{{ g.label }}</span>
                </label>
              </div>
            </div>

            <button type="submit"
              class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-colors">
              Continue to Post-Match
            </button>
          </form>

          <!-- POST-MATCH FORM -->
          <form v-else @submit.prevent="submitPracticeForm" class="space-y-6">

            <!-- Result -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Match Result</label>
              <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-semibold cursor-pointer transition-colors"
                  :class="postMatch.win === true
                    ? 'border-green-500 bg-green-600/20 text-green-300'
                    : 'border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-500'">
                  <input type="radio" :value="true" v-model="postMatch.win" class="hidden" />
                  Victory
                </label>
                <label class="flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-semibold cursor-pointer transition-colors"
                  :class="postMatch.win === false
                    ? 'border-red-500 bg-red-600/20 text-red-300'
                    : 'border-gray-600 bg-gray-900 text-gray-400 hover:border-gray-500'">
                  <input type="radio" :value="false" v-model="postMatch.win" class="hidden" />
                  Defeat
                </label>
              </div>
            </div>

            <!-- Match ID -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Match ID <span class="text-gray-500 font-normal">(optional)</span></label>
              <input type="text" v-model="postMatch.matchId"
                placeholder="NA1_1234567890"
                class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono" />
            </div>

            <!-- Lesson -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">What did you learn?</label>
              <textarea v-model="postMatch.lesson" rows="3" required
                placeholder="Describe a takeaway from this game..."
                class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"></textarea>
            </div>

            <!-- Ratings -->
            <div class="space-y-4">
              <div v-for="rating in ratings" :key="rating.key">
                <div class="flex justify-between items-center mb-1">
                  <label class="text-sm font-medium text-gray-300">{{ rating.label }}</label>
                  <span class="text-sm font-bold" :class="ratingColor(postMatch[rating.key])">{{ postMatch[rating.key] }} / 5</span>
                </div>
                <div class="flex gap-2">
                  <button v-for="n in 5" :key="n" type="button"
                    @click="postMatch[rating.key] = n"
                    class="flex-1 h-8 rounded-md border text-xs font-bold transition-colors"
                    :class="postMatch[rating.key] >= n
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-gray-600 bg-gray-900 text-gray-500 hover:border-gray-500'">
                    {{ n }}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button type="button" @click="preMatchFormSubmitted = false"
                class="px-4 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 text-sm transition-colors">
                Back
              </button>
              <button type="submit" :disabled="isSubmitting"
                class="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors">
                {{ isSubmitting ? 'Saving...' : 'Submit Practice Log' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right splash -->
      <div class="hidden lg:block w-44 flex-shrink-0">
        <Transition name="fade">
          <img v-if="opponentChampionSplash" :src="opponentChampionSplash" :alt="preMatch.opponentChampion"
            class="w-full rounded-xl shadow-lg object-cover" />
        </Transition>
      </div>
    </div>

    <!-- Recent entries -->
    <div v-if="history.length" class="mt-10">
      <h2 class="text-xl font-bold text-white mb-4">Recent Sessions</h2>
      <div class="space-y-3">
        <div v-for="entry in history" :key="entry._id"
          class="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col gap-3">

          <!-- Top row -->
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-xs font-bold px-2 py-0.5 rounded"
              :class="entry.win ? 'bg-green-700 text-green-200' : 'bg-red-800 text-red-200'">
              {{ entry.win ? 'W' : 'L' }}
            </span>
            <span class="text-sm font-semibold text-white">{{ entry.playerName }}</span>
            <span class="text-xs text-gray-500 uppercase tracking-wider">{{ entry.gameMode }}</span>
            <span class="text-xs text-gray-500">{{ entry.role }}</span>
            <span class="text-gray-600 text-xs">vs</span>
            <span class="text-xs text-gray-400">{{ entry.myChampion }} vs {{ entry.opponentChampion }}</span>
            <span class="ml-auto text-xs text-gray-600">{{ formatDate(entry.submittedAt) }}</span>
          </div>
          <div v-if="entry.matchId" class="text-xs text-gray-500 font-mono">
            Match ID: <span class="text-gray-400">{{ entry.matchId }}</span>
          </div>

          <!-- Goal / Lesson -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div v-if="entry.goal">
              <p class="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Goal</p>
              <p class="text-gray-300">{{ entry.goal }}</p>
            </div>
            <div v-if="entry.lesson">
              <p class="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Lesson</p>
              <p class="text-gray-300">{{ entry.lesson }}</p>
            </div>
          </div>

          <!-- Ratings -->
          <div class="flex gap-4 text-xs text-gray-400">
            <span>Focus <span class="font-bold text-white">{{ entry.focus }}/5</span></span>
            <span>Performance <span class="font-bold text-white">{{ entry.performance }}/5</span></span>
            <span>Mental <span class="font-bold text-white">{{ entry.mental }}/5</span></span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import { ref, reactive, watch, onMounted } from 'vue'
import ResponseBox from '@/components/ResponseBox.vue'
import ChampionPicker from '@/components/ChampionPicker.vue'
import PlayerPicker from '@/components/PlayerPicker.vue'
import TopSvg from '@/components/lanes/TopSvg.vue'
import JungleSvg from '@/components/lanes/JungleSvg.vue'
import MiddleSvg from '@/components/lanes/MiddleSvg.vue'
import BotSvg from '@/components/lanes/BotSvg.vue'
import SupportSvg from '@/components/lanes/SupportSvg.vue'

const QUEUE_TYPES = [
  { value: 'solo',   label: 'Solo Ranked' },
  { value: 'duo',    label: 'Duo Ranked' },
  { value: 'flex',   label: 'Flex Ranked' },
  { value: 'normal', label: 'Normal Draft' },
]

const ROLES = [
  { value: 'TOP',     label: 'Top',     icon: TopSvg },
  { value: 'JUNGLE',  label: 'Jungle',  icon: JungleSvg },
  { value: 'MID',     label: 'Mid',     icon: MiddleSvg },
  { value: 'BOTTOM',  label: 'ADC',     icon: BotSvg },
  { value: 'SUPPORT', label: 'Support', icon: SupportSvg },
]

const RATINGS = [
  { key: 'focus',       label: 'Focus' },
  { key: 'performance', label: 'Performance' },
  { key: 'mental',      label: 'Mental' },
]

const GOALS = [
  { label: 'Fighting',          icon: '⚔️' },
  { label: 'Farming',           icon: '🌾' },
  { label: 'Survivability',     icon: '🛡️' },
  { label: 'Wave Management',   icon: '🌊' },
  { label: 'Vision Control',    icon: '👁️' },
  { label: 'Roaming',           icon: '🗺️' },
  { label: 'Objective Control', icon: '🎯' },
  { label: 'Trading',           icon: '⚡' },
  { label: 'Active Items',      icon: '🎒' },
  { label: 'Positioning',       icon: '📐' },
  { label: 'Matchups',          icon: '🔍' },
  { label: 'Map Awareness',     icon: '🧭' },
]

function emptyPreMatch() {
  return { playerName: '', goal: '', gameMode: '', role: '', myChampion: '', opponentChampion: '' }
}
function emptyPostMatch() {
  return { win: null, matchId: '', lesson: '', focus: 3, performance: 3, mental: 3 }
}

export default {
  name: 'PracticeView',
  components: { ResponseBox, ChampionPicker, PlayerPicker, TopSvg, JungleSvg, MiddleSvg, BotSvg, SupportSvg },
  setup() {
    const champions             = ref([])
    const preMatchFormSubmitted = ref(false)
    const isSubmitting          = ref(false)
    const responseMessage       = ref('')
    const isSuccess             = ref(false)
    const myChampionSplash      = ref('')
    const opponentChampionSplash = ref('')
    const history               = ref([])

    const preMatch  = reactive(emptyPreMatch())
    const postMatch = reactive(emptyPostMatch())

    const queueTypes = QUEUE_TYPES
    const roles      = ROLES
    const ratings    = RATINGS
    const goals      = GOALS

    const ratingColor = (v) => {
      if (v >= 4) return 'text-green-400'
      if (v >= 3) return 'text-yellow-400'
      return 'text-red-400'
    }

    const formatDate = (iso) => {
      if (!iso) return ''
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    watch(() => preMatch.myChampion, (val) => {
      myChampionSplash.value = val
        ? `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${val}_0.jpg`
        : ''
    })

    watch(() => preMatch.opponentChampion, (val) => {
      opponentChampionSplash.value = val
        ? `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${val}_0.jpg`
        : ''
    })

    const submitPrematchForm = () => {
      preMatchFormSubmitted.value = true
    }

    const loadHistory = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + '/practice/')
        history.value = data
      } catch { /* silently ignore */ }
    }

    const submitPracticeForm = async () => {
      isSubmitting.value = true
      const payload = { ...preMatch, ...postMatch }
      try {
        await axios.post(import.meta.env.VITE_API_URL + '/practice/add', payload)
        Object.assign(preMatch, emptyPreMatch())
        Object.assign(postMatch, emptyPostMatch())
        myChampionSplash.value       = ''
        opponentChampionSplash.value = ''
        preMatchFormSubmitted.value  = false
        responseMessage.value        = 'Practice log saved!'
        isSuccess.value              = true
        await loadHistory()
      } catch (err) {
        console.error(err)
        preMatchFormSubmitted.value = false
        responseMessage.value = err?.response?.data?.message ?? 'Error saving practice log. Please try again.'
        isSuccess.value = false
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(async () => {
      try {
        const versions = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json', { withCredentials: false })
        const latest   = versions.data[0]
        const champs   = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`, { withCredentials: false })
        champions.value = Object.values(champs.data.data).sort((a, b) => a.name.localeCompare(b.name))
      } catch (err) {
        console.error('Error fetching champions:', err)
      }
      loadHistory()
    })

    return {
      champions, preMatchFormSubmitted, isSubmitting,
      responseMessage, isSuccess,
      myChampionSplash, opponentChampionSplash,
      preMatch, postMatch,
      queueTypes, roles, ratings, goals,
      history,
      ratingColor, formatDate,
      submitPrematchForm, submitPracticeForm,
    }
  }
}
</script>