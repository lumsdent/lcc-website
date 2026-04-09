<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">

    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white mb-1">Tournament Manager</h1>
      <p class="text-gray-400 text-sm">Generate Riot tournament codes and track match results.</p>
    </div>

    <!-- Admin auth banner -->
    <div class="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6 flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span class="text-sm text-green-300 font-semibold flex-shrink-0">&#10003; Admin access enabled</span>
    </div>

    <ResponseBox v-if="responseMessage" :message="responseMessage" :isSuccess="isSuccess" class="mb-6" />

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- LEFT: Provider + Tournaments list -->
      <div class="space-y-4">

        <!-- Provider card -->
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Provider</h2>
          <div v-if="provider">
            <p class="text-xs text-gray-500 mb-0.5">Provider ID</p>
            <p class="text-white font-mono font-bold text-lg mb-1">{{ provider.providerId }}</p>
            <p class="text-xs text-gray-500 mb-0.5">Region</p>
            <p class="text-gray-300 text-sm mb-1">{{ provider.region }}</p>
            <p class="text-xs text-gray-500 mb-0.5">Callback URL</p>
            <p class="text-gray-400 text-xs font-mono break-all">{{ provider.callbackUrl }}</p>
            <p class="text-xs text-gray-600 mt-2">Registered {{ formatDate(provider.registeredAt) }}</p>
          </div>
          <div v-else-if="loadingProvider" class="text-sm text-gray-500">Loading...</div>
          <div v-else>
            <p class="text-sm text-gray-400 mb-3">No provider registered yet.</p>
            <div class="space-y-2">
              <input type="text" v-model="registerForm.callbackUrl" placeholder="Callback URL (public)"
                class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              <select v-model="registerForm.region"
                class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500">
                <option value="NA">NA</option><option value="EUW">EUW</option>
                <option value="EUNE">EUNE</option><option value="BR">BR</option>
              </select>
              <button @click="registerProvider" :disabled="!isAuthorized || registering"
                class="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                {{ registering ? 'Registering...' : 'Register Provider' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Create tournament -->
        <div v-if="provider" class="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">New Tournament</h2>
          <div class="space-y-2">
            <input type="text" v-model="newTournamentName" placeholder="e.g. LCC Season 4 Week 3"
              class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            <button @click="createTournament" :disabled="!isAuthorized || !newTournamentName.trim() || creating"
              class="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
              {{ creating ? 'Creating...' : 'Create Tournament' }}
            </button>
          </div>
        </div>

        <!-- Tournament list -->
        <div v-if="tournaments.length" class="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Tournaments</h2>
          <ul class="space-y-1">
            <li v-for="t in tournaments" :key="t._id"
              @click="selectTournament(t)"
              class="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors"
              :class="selectedTournament?._id === t._id
                ? 'bg-blue-600/20 border border-blue-500 text-blue-300'
                : 'hover:bg-gray-700 text-gray-300 border border-transparent'">
              <div>
                <p class="font-medium leading-tight">{{ t.name }}</p>
                <p class="text-xs text-gray-500">ID: {{ t.tournamentId }}</p>
              </div>
              <span class="text-xs px-1.5 py-0.5 rounded"
                :class="t.active ? 'bg-green-800 text-green-300' : 'bg-gray-700 text-gray-400'">
                {{ t.active ? 'Active' : 'Ended' }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- RIGHT: Tournament detail -->
      <div class="lg:col-span-2 space-y-4">

        <div v-if="!selectedTournament" class="flex items-center justify-center h-48 text-gray-600 text-sm">
          Select a tournament on the left to manage codes.
        </div>

        <template v-else>
          <!-- Tournament header -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-xl font-bold text-white">{{ selectedTournament.name }}</h2>
                <p class="text-sm text-gray-400 mt-0.5">Tournament ID: <span class="font-mono text-gray-300">{{ selectedTournament.tournamentId }}</span></p>
              </div>
              <span class="text-xs px-2 py-1 rounded"
                :class="selectedTournament.active ? 'bg-green-800 text-green-300' : 'bg-gray-700 text-gray-400'">
                {{ selectedTournament.active ? 'Active' : 'Ended' }}
              </span>
            </div>
          </div>

          <!-- Generate codes form -->
          <div class="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Generate Match Codes</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2">
                <label class="block text-xs text-gray-400 mb-1">Match Label</label>
                <input type="text" v-model="codeForm.matchLabel" placeholder="e.g. Week 3 – Alpha vs Bravo G1"
                  class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Team A</label>
                <input type="text" v-model="codeForm.teamA" placeholder="Team Alpha"
                  class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Team B</label>
                <input type="text" v-model="codeForm.teamB" placeholder="Team Bravo"
                  class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Number of Codes</label>
                <select v-model.number="codeForm.count"
                  class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Pick Type</label>
                <select v-model="codeForm.pickType"
                  class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="TOURNAMENT_DRAFT">Tournament Draft</option>
                  <option value="DRAFT_MODE">Draft Mode</option>
                  <option value="BLIND_PICK">Blind Pick</option>
                  <option value="ALL_RANDOM">All Random</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Map</label>
                <select v-model="codeForm.mapType"
                  class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="SUMMONERS_RIFT">Summoner's Rift</option>
                  <option value="HOWLING_ABYSS">Howling Abyss</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Spectators</label>
                <select v-model="codeForm.spectatorType"
                  class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="ALL">All</option>
                  <option value="LOBBYONLY">Lobby Only</option>
                  <option value="NONE">None</option>
                </select>
              </div>
            </div>
            <button @click="generateCodes"
              :disabled="!isAuthorized || generatingCodes"
              class="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold py-2.5 rounded-lg transition-colors">
              {{ generatingCodes ? 'Generating...' : `Generate ${codeForm.count} Code${codeForm.count > 1 ? 's' : ''}` }}
            </button>
          </div>

          <!-- Codes list -->
          <div v-if="loadingCodes" class="text-center text-gray-500 py-8 text-sm">Loading codes...</div>
          <div v-else-if="!tournamentCodes.length" class="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center text-gray-500 text-sm">
            No codes generated yet.
          </div>
          <div v-else class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Codes ({{ tournamentCodes.length }})
            </h3>
            <div v-for="c in tournamentCodes" :key="c._id"
              class="bg-gray-800 border rounded-xl p-4 space-y-2 transition-colors"
              :class="c.status === 'complete' ? 'border-green-700' : 'border-gray-700'">

              <!-- Code header -->
              <div class="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p v-if="c.matchLabel" class="text-sm font-semibold text-white">{{ c.matchLabel }}</p>
                  <p v-if="c.teamA || c.teamB" class="text-xs text-gray-400">{{ c.teamA }} vs {{ c.teamB }}</p>
                </div>
                <span class="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                  :class="c.status === 'complete' ? 'bg-green-800 text-green-300' : 'bg-yellow-800 text-yellow-300'">
                  {{ c.status === 'complete' ? 'Complete' : 'Pending' }}
                </span>
              </div>

              <!-- Code string + copy -->
              <div class="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2">
                <code class="text-blue-300 text-sm flex-1 break-all">{{ c.code }}</code>
                <button @click="copyCode(c.code)"
                  class="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                  :title="copied === c.code ? 'Copied!' : 'Copy code'">
                  <svg v-if="copied !== c.code" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>

              <!-- Match result summary -->
              <div v-if="c.matchResult" class="text-xs text-gray-400 border-t border-gray-700 pt-2 space-y-0.5">
                <p v-if="c.matchResult.gameId" class="font-mono">Match ID: {{ c.matchResult.gameId }}</p>
                <p v-if="c.matchResult.winningTeam">Winning Team: <span class="text-white">{{ c.matchResult.winningTeam }}</span></p>
                <p>Completed: {{ formatDate(c.completedAt) }}</p>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between text-xs text-gray-600">
                <span>Generated {{ formatDate(c.createdAt) }}</span>
                <button @click="deleteCode(c)" class="text-red-600 hover:text-red-400 transition-colors">Remove</button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, reactive, computed } from 'vue'
import ResponseBox from '@/components/ResponseBox.vue'

const API = () => import.meta.env.VITE_API_URL

function defaultCodeForm() {
  return { matchLabel: '', teamA: '', teamB: '', count: 1, pickType: 'TOURNAMENT_DRAFT', mapType: 'SUMMONERS_RIFT', spectatorType: 'ALL' }
}

export default {
  name: 'TournamentView',
  components: { ResponseBox },
  setup() {
    const isAuthorized      = true
    const responseMessage   = ref('')
    const isSuccess         = ref(false)

    const provider          = ref(null)
    const loadingProvider   = ref(false)
    const registering       = ref(false)
    const registerForm      = reactive({ callbackUrl: '', region: 'NA' })

    const tournaments       = ref([])
    const newTournamentName = ref('')
    const creating          = ref(false)

    const selectedTournament = ref(null)
    const tournamentCodes    = ref([])
    const loadingCodes       = ref(false)
    const generatingCodes    = ref(false)
    const codeForm           = reactive(defaultCodeForm())
    const copied             = ref(null)

    const flash = (msg, ok = true) => {
      responseMessage.value = msg
      isSuccess.value = ok
    }

    const formatDate = (iso) => {
      if (!iso) return '—'
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    const loadProvider = async () => {
      loadingProvider.value = true
      try {
        const { data } = await axios.get(API() + '/tournament/provider', { withCredentials: false })
        provider.value = data
      } catch (e) {
        if (e.response?.status !== 404) flash('Failed to load provider info.', false)
      } finally {
        loadingProvider.value = false
      }
    }

    const loadTournaments = async () => {
      try {
        const { data } = await axios.get(API() + '/tournament/', { withCredentials: false })
        tournaments.value = data
      } catch { /* silent */ }
    }

    const loadCodes = async (tournamentId) => {
      loadingCodes.value = true
      try {
        const { data } = await axios.get(API() + `/tournament/${tournamentId}/codes`, { withCredentials: false })
        tournamentCodes.value = data
      } catch { tournamentCodes.value = [] }
      finally { loadingCodes.value = false }
    }

    const registerProvider = async () => {
      registering.value = true
      try {
        const { data } = await axios.post(API() + '/tournament/provider/register', {
          callbackUrl: registerForm.callbackUrl,
          region: registerForm.region,
        })
        flash(data.message)
        await loadProvider()
      } catch (e) {
        flash(e.response?.data?.message ?? 'Registration failed.', false)
      } finally { registering.value = false }
    }

    const createTournament = async () => {
      creating.value = true
      try {
        const { data } = await axios.post(API() + '/tournament/create', {
          name: newTournamentName.value.trim(),
        })
        flash(data.message)
        newTournamentName.value = ''
        await loadTournaments()
      } catch (e) {
        flash(e.response?.data?.message ?? 'Failed to create tournament.', false)
      } finally { creating.value = false }
    }

    const selectTournament = async (t) => {
      selectedTournament.value = t
      Object.assign(codeForm, defaultCodeForm())
      await loadCodes(t.tournamentId)
    }

    const generateCodes = async () => {
      if (!selectedTournament.value) return
      generatingCodes.value = true
      try {
        const { data } = await axios.post(
          API() + `/tournament/${selectedTournament.value.tournamentId}/codes`,
          { ...codeForm }
        )
        flash(data.message)
        Object.assign(codeForm, defaultCodeForm())
        await loadCodes(selectedTournament.value.tournamentId)
      } catch (e) {
        flash(e.response?.data?.message ?? 'Failed to generate codes.', false)
      } finally { generatingCodes.value = false }
    }

    const deleteCode = async (c) => {
      if (!isAuthorized) return flash('Not authorized.', false)
      try {
        await axios.delete(API() + `/tournament/codes/${encodeURIComponent(c.code)}`)
        tournamentCodes.value = tournamentCodes.value.filter(x => x._id !== c._id)
        flash('Code removed.')
      } catch (e) {
        flash(e.response?.data?.message ?? 'Failed to delete code.', false)
      }
    }

    const copyCode = (code) => {
      navigator.clipboard.writeText(code)
      copied.value = code
      setTimeout(() => { copied.value = null }, 2000)
    }

    // Init
    loadProvider()
    loadTournaments()

    return {
      isAuthorized, responseMessage, isSuccess,
      provider, loadingProvider, registering, registerForm,
      tournaments, newTournamentName, creating,
      selectedTournament, tournamentCodes, loadingCodes,
      generatingCodes, codeForm, copied,
      formatDate, registerProvider, createTournament,
      selectTournament, generateCodes, deleteCode, copyCode,
    }
  }
}
</script>
