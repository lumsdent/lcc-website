<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">

    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-1">Admin Panel</h1>
      <p class="text-gray-400 text-sm">League Community Cup internal tools</p>
    </div>

    <!-- Tab bar -->
    <div class="flex gap-0 mb-8 border-b border-gray-700">
      <button
        v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id; statusMsg = ''"
        :class="activeTab === tab.id
          ? 'border-b-2 border-blue-500 text-white'
          : 'border-b-2 border-transparent text-gray-400 hover:text-gray-200'"
        class="px-5 py-3 text-sm font-medium transition-colors -mb-px whitespace-nowrap"
      >{{ tab.label }}</button>
    </div>

    <!-- ── Add Match ── -->
    <div v-if="activeTab === 'add'" class="space-y-5">
      <p class="text-gray-400 text-sm">Fetch a match from Riot's API and save it to the database.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label class="field-label">Riot Match ID</label>
          <input v-model="add.matchId" type="text" placeholder="e.g. 4980010890" class="field-input" />
        </div>
        <div>
          <label class="field-label">Season</label>
          <select v-model="add.season" class="field-input">
            <option value="">Select season...</option>
            <option v-for="s in seasons" :key="s" :value="String(s)">Season {{ s }}</option>
          </select>
        </div>
        <div>
          <label class="field-label">Blue Team</label>
          <select v-model="add.blueTeam" class="field-input">
            <option value="">Select team...</option>
            <option v-for="t in addTeams" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div>
          <label class="field-label">Red Team</label>
          <select v-model="add.redTeam" class="field-input">
            <option value="">Select team...</option>
            <option v-for="t in addTeams" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="field-label">Password</label>
        <input v-model="password" type="password" placeholder="Admin password" class="field-input max-w-xs" />
      </div>

      <button @click="submitAdd" :disabled="loading"
        class="rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition-colors">
        {{ loading ? 'Submitting...' : 'Add Match' }}
      </button>
      <StatusMsg :msg="statusMsg" :error="isError" />
    </div>

    <!-- ── Refresh ── -->
    <div v-if="activeTab === 'refresh'" class="space-y-5">
      <div class="rounded-xl border border-yellow-700/50 bg-yellow-900/10 px-5 py-4 text-sm text-yellow-300">
        <strong>Warning:</strong> This re-fetches every match in
        <code class="text-yellow-200 text-xs">matches_index</code> from the Riot API and overwrites existing records.
        This may take several minutes.
      </div>

      <div>
        <label class="field-label">Password</label>
        <input v-model="password" type="password" placeholder="Admin password" class="field-input max-w-xs" />
      </div>

      <button @click="submitRefresh" :disabled="loading"
        class="rounded-lg bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition-colors">
        {{ loading ? 'Refreshing...' : 'Refresh All Matches' }}
      </button>
      <StatusMsg :msg="statusMsg" :error="isError" />

      <div v-if="refreshErrors.length" class="rounded-xl border border-red-700/50 bg-red-900/10 p-4">
        <p class="text-sm font-semibold text-red-400 mb-2">Errors ({{ refreshErrors.length }})</p>
        <ul class="space-y-1">
          <li v-for="(e, i) in refreshErrors" :key="i" class="text-xs text-red-300 font-mono">{{ e }}</li>
        </ul>
      </div>
    </div>

    <!-- ── Manual Entry ── -->
    <div v-if="activeTab === 'manual'" class="space-y-6">
      <p class="text-gray-400 text-sm">Manually create a match record without using the Riot API.</p>

      <!-- Match meta -->
      <div class="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h2 class="text-sm font-semibold text-white mb-4">Match Info</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label class="field-label">LCC Match ID</label>
            <input v-model="manual.matchIdLCC" type="text" placeholder="e.g. 15" class="field-input" />
          </div>
          <div>
            <label class="field-label">Season</label>
            <select v-model="manual.season" class="field-input" @change="fetchManualTeams">
              <option value="">Select...</option>
              <option v-for="s in seasons" :key="s" :value="String(s)">Season {{ s }}</option>
            </select>
          </div>
          <div>
            <label class="field-label">Duration</label>
            <div class="flex items-center gap-2">
              <input v-model.number="manual.gameDurationMins" type="number" min="0" max="90" class="field-input" placeholder="MM" />
              <span class="text-gray-400 text-sm">m</span>
              <input v-model.number="manual.gameDurationSecs" type="number" min="0" max="59" class="field-input" placeholder="SS" />
              <span class="text-gray-400 text-sm">s</span>
            </div>
          </div>
          <div>
            <label class="field-label">Game Version</label>
            <input v-model="manual.gameVersion" type="text" placeholder="e.g. 15.5.1" class="field-input" />
          </div>
        </div>
      </div>

      <!-- Blue Team -->
      <div class="bg-gray-800 rounded-xl border border-blue-700/50 p-5">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 class="text-sm font-semibold text-blue-300">&#9632; Blue Team</h2>
          <div class="flex items-center gap-4">
            <select v-model="manual.blue.name" class="field-input w-44">
              <option value="">Select team...</option>
              <option v-for="t in manualTeams" :key="t" :value="t">{{ t }}</option>
            </select>
            <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" v-model="manual.blue.won" class="accent-blue-500" />
              Won
            </label>
          </div>
        </div>
        <PlayerTable :players="manual.blue.players" :playerOptions="manualPlayers" :championOptions="manualChampions" />
      </div>

      <!-- Red Team -->
      <div class="bg-gray-800 rounded-xl border border-red-700/50 p-5">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 class="text-sm font-semibold text-red-300">&#9632; Red Team</h2>
          <div class="flex items-center gap-4">
            <select v-model="manual.red.name" class="field-input w-44">
              <option value="">Select team...</option>
              <option v-for="t in manualTeams" :key="t" :value="t">{{ t }}</option>
            </select>
            <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" v-model="manual.red.won" class="accent-blue-500" />
              Won
            </label>
          </div>
        </div>
        <PlayerTable :players="manual.red.players" :playerOptions="manualPlayers" :championOptions="manualChampions" />
      </div>

      <div>
        <label class="field-label">Password</label>
        <input v-model="password" type="password" placeholder="Admin password" class="field-input max-w-xs" />
      </div>

      <button @click="submitManual" :disabled="loading"
        class="rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition-colors">
        {{ loading ? 'Saving...' : 'Create Match' }}
      </button>
      <StatusMsg :msg="statusMsg" :error="isError" />
    </div>

    <!-- ── Assign MVP ── -->
    <div v-if="activeTab === 'mvp'" class="space-y-5">
      <p class="text-gray-400 text-sm">Assign an MVP to an existing match.</p>

      <div class="flex items-end gap-3">
        <div>
          <label class="field-label">LCC Match ID</label>
          <input v-model="mvp.matchIdLCC" type="text" placeholder="e.g. 12"
            class="field-input w-40" @keydown.enter="loadMvpMatch" />
        </div>
        <button @click="loadMvpMatch" :disabled="mvp.loadingPlayers"
          class="rounded-lg bg-gray-700 hover:bg-gray-600 border border-gray-600 px-4 py-2 text-sm text-gray-200 transition-colors disabled:opacity-50 mb-0.5">
          {{ mvp.loadingPlayers ? 'Loading...' : 'Load Players' }}
        </button>
      </div>

      <p v-if="mvp.loadError" class="text-sm text-red-400">{{ mvp.loadError }}</p>

      <div v-if="mvp.matchName" class="text-sm text-gray-400">
        <span class="text-white font-medium">{{ mvp.matchName }}</span>
        <span v-if="mvp.currentMvp"> &middot; Current MVP:
          <span class="text-blue-400 font-medium">{{ mvp.currentMvp }}</span>
        </span>
      </div>

      <div v-if="mvp.players.length" class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-700 text-xs text-gray-500 uppercase tracking-wide">
              <th class="px-4 py-2 text-left w-8"></th>
              <th class="px-4 py-2 text-left">Player</th>
              <th class="px-4 py-2 text-left">Champion</th>
              <th class="px-4 py-2 text-left">Team</th>
              <th class="px-4 py-2 text-center">K/D/A</th>
              <th class="px-4 py-2 text-center">KDA</th>
              <th class="px-4 py-2 text-center">Damage</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in mvp.players" :key="p.puuid"
              @click="mvp.selectedPuuid = p.puuid"
              :class="mvp.selectedPuuid === p.puuid
                ? 'bg-blue-900/30 border-l-2 border-l-blue-500'
                : 'hover:bg-gray-700/40 border-l-2 border-l-transparent'"
              class="cursor-pointer transition-colors border-b border-gray-700/50"
            >
              <td class="px-4 py-2.5">
                <div :class="mvp.selectedPuuid === p.puuid ? 'bg-blue-500 border-blue-500' : 'border-gray-600'"
                  class="w-3.5 h-3.5 rounded-full border-2 transition-colors"></div>
              </td>
              <td class="px-4 py-2.5 text-white font-medium">{{ p.name }}</td>
              <td class="px-4 py-2.5 text-gray-300">{{ p.champion }}</td>
              <td class="px-4 py-2.5 text-gray-400 text-xs">{{ p.team }}</td>
              <td class="px-4 py-2.5 text-center text-gray-300">{{ p.kills }}/{{ p.deaths }}/{{ p.assists }}</td>
              <td class="px-4 py-2.5 text-center font-medium"
                :class="p.kda >= 3 ? 'text-green-400' : p.kda >= 2 ? 'text-yellow-400' : 'text-red-400'">
                {{ p.kda }}
              </td>
              <td class="px-4 py-2.5 text-center text-gray-400">{{ p.dmg?.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <template v-if="mvp.players.length">
        <div>
          <label class="field-label">Password</label>
          <input v-model="password" type="password" placeholder="Admin password" class="field-input max-w-xs" />
        </div>
        <button @click="submitMvp" :disabled="loading || !mvp.selectedPuuid"
          class="rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition-colors">
          {{ loading ? 'Saving...' : 'Assign MVP' }}
        </button>
        <StatusMsg :msg="statusMsg" :error="isError" />
      </template>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import { ref, watch, defineComponent, h, onMounted } from 'vue'

// ── Inline sub-components ─────────────────────────────────────────────────

const ROLES = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']

const StatusMsg = defineComponent({
  props: { msg: String, error: Boolean },
  setup(props) {
    return () => props.msg
      ? h('div', {
          class: `mt-1 rounded-lg border px-4 py-2.5 text-sm ${
            props.error
              ? 'border-red-700/50 bg-red-900/10 text-red-300'
              : 'border-green-700/50 bg-green-900/10 text-green-300'
          }`
        }, props.msg)
      : null
  }
})

const inputCls = 'w-full rounded border border-gray-600 bg-gray-900 px-1.5 py-1 text-xs text-white focus:border-blue-500 focus:outline-none'

const PlayerTable = defineComponent({
  props: { players: Array, playerOptions: Array, championOptions: Array },
  setup(props) {
    return () => h('div', { class: 'overflow-x-auto' },
      h('table', { class: 'w-full text-xs min-w-max' }, [
        h('thead', {}, h('tr', { class: 'border-b border-gray-700' },
          ['Role', 'Player', 'Champion', 'K', 'D', 'A', 'CS', 'CS@14', 'CSD', 'Damage', 'Gold', 'Vision', 'KP%', 'FB', 'Solo K']
            .map(col => h('th', { class: 'px-1.5 py-1.5 text-left text-gray-500 font-medium whitespace-nowrap' }, col))
        )),
        h('tbody', {}, props.players.map((p, i) =>
          h('tr', { key: i, class: 'border-b border-gray-700/40' }, [
            // Role
            h('td', { class: 'px-1 py-1' },
              h('select', {
                value: p.role,
                onInput: e => { p.role = e.target.value },
                class: inputCls + ' w-24'
              }, [
                h('option', { value: '' }, '—'),
                ...ROLES.map(r => h('option', { value: r }, r.slice(0, 3)))
              ])
            ),
            // Player name
            h('td', { class: 'px-1 py-1' },
              h('select', {
                value: p.name,
                onInput: e => {
                  const opt = (props.playerOptions || []).find(o => o.name === e.target.value)
                  p.name = e.target.value
                  if (opt) p.puuid = opt.puuid
                },
                class: inputCls + ' w-36'
              }, [
                h('option', { value: '' }, '—'),
                ...(props.playerOptions || []).map(o => h('option', { value: o.name }, o.name))
              ])
            ),
            // Champion
            h('td', { class: 'px-1 py-1' },
              h('select', {
                value: p.champion,
                onInput: e => { p.champion = e.target.value },
                class: inputCls + ' w-32'
              }, [
                h('option', { value: '' }, '—'),
                ...(props.championOptions || []).map(c => h('option', { value: c }, c))
              ])
            ),
            // Numeric stats
            ...['kills', 'deaths', 'assists', 'cs', 'cs14', 'csd', 'dmg', 'goldEarned', 'visionScore', 'killParticipation', 'soloKills'].map(f =>
              h('td', { class: 'px-1 py-1' },
                h('input', {
                  value: p[f], type: 'number', min: 0,
                  onInput: e => { p[f] = Number(e.target.value) },
                  class: inputCls + ' w-14'
                })
              )
            ),
            // First blood
            h('td', { class: 'px-1.5 py-1 text-center' },
              h('input', {
                type: 'checkbox', checked: p.firstBlood,
                onChange: e => { p.firstBlood = e.target.checked },
                class: 'accent-blue-500'
              })
            ),
          ])
        ))
      ])
    )
  }
})

// ── Main component ────────────────────────────────────────────────────────

const defaultPlayer = () => ({
  role: '', name: '', puuid: '', champion: '',
  kills: 0, deaths: 0, assists: 0,
  cs: 0, cs14: 0, csd: 0,
  dmg: 0, goldEarned: 0, visionScore: 0,
  wardsPlaced: 0, wardsKilled: 0,
  firstBlood: false, killParticipation: 0, soloKills: 0,
})

export default {
  name: 'MatchFormView',
  components: { StatusMsg, PlayerTable },

  setup() {
    const API = import.meta.env.VITE_API_URL
    const tabs = [
      { id: 'add',     label: 'Add Match'   },
      { id: 'refresh', label: 'Refresh'      },
      { id: 'manual',  label: 'Manual Entry' },
      { id: 'mvp',     label: 'Assign MVP'   },
    ]
    const activeTab = ref('add')
    const password  = ref('')
    const isError   = ref(false)
    const statusMsg = ref('')
    const loading   = ref(false)
    const seasons   = ref([])

    // ── Add tab ───────────────────────────────────────────────
    const add      = ref({ matchId: '', season: '', blueTeam: '', redTeam: '' })
    const addTeams = ref([])

    const fetchAddTeams = async () => {
      if (!add.value.season) return
      try {
        const res = await axios.get(`${API}/teams/${add.value.season}`)
        addTeams.value = res.data.map(t => t.team_name)
      } catch { addTeams.value = [] }
    }
    watch(() => add.value.season, fetchAddTeams)

    const submitAdd = async () => {
      loading.value = true; statusMsg.value = ''
      try {
        const res = await axios.post(`${API}/matches/add`, {
          matchId:  add.value.matchId,
          season:   add.value.season,
          blueTeam: add.value.blueTeam,
          redTeam:  add.value.redTeam,
          password: password.value,
        })
        statusMsg.value = res.data.message; isError.value = false
        add.value = { matchId: '', season: '', blueTeam: '', redTeam: '' }
      } catch (e) {
        statusMsg.value = e.response?.data?.message ?? 'Error submitting match.'
        isError.value = true
      } finally { loading.value = false }
    }

    // ── Refresh tab ───────────────────────────────────────────
    const refreshErrors = ref([])

    const submitRefresh = async () => {
      loading.value = true; statusMsg.value = ''; refreshErrors.value = []
      try {
        const res = await axios.post(`${API}/matches/refresh`, { password: password.value })
        statusMsg.value = res.data.message; isError.value = false
        if (res.data.errors?.length) refreshErrors.value = res.data.errors
      } catch (e) {
        statusMsg.value = e.response?.data?.message ?? 'Refresh failed.'
        isError.value = true
      } finally { loading.value = false }
    }

    // ── Manual tab ────────────────────────────────────────────
    const manualTeams = ref([])
    const manualPlayers = ref([])
    const manualChampions = ref([])
    const manual = ref({
      matchIdLCC: '', season: '', gameDurationMins: 30, gameDurationSecs: 0, gameVersion: '15.5.1',
      blue: { name: '', won: true,  players: Array.from({ length: 5 }, defaultPlayer) },
      red:  { name: '', won: false, players: Array.from({ length: 5 }, defaultPlayer) },
    })

    const fetchManualTeams = async () => {
      if (!manual.value.season) return
      try {
        const season = manual.value.season
        const teamsRes = await axios.get(`${API}/teams/${season}`)
        manualTeams.value = teamsRes.data.map(t => t.team_name)
        // Flatten all players across all rosters for this season
        const seen = new Set()
        const players = []
        for (const team of teamsRes.data) {
          const roster = team.rosters?.[String(season)] ?? team.rosters?.[parseInt(season)] ?? []
          for (const entry of roster) {
            const name  = entry.player?.userName || entry.player?.name || entry.name  || entry.userName || ''
            const puuid = entry.player?.puuid    || entry.puuid || ''
            if (name && !seen.has(name)) { seen.add(name); players.push({ name, puuid, team: team.team_name }) }
          }
        }
        manualPlayers.value = players.sort((a, b) => a.name.localeCompare(b.name))
      } catch (e) {
        console.error('fetchManualTeams error:', e)
        manualTeams.value = []; manualPlayers.value = []
      }
    }
    watch(() => manual.value.season, fetchManualTeams)

    // Load champion list once on mount using the current DDragon version
    onMounted(async () => {
      try {
        const noCredentials = { withCredentials: false }
        const verRes = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json', noCredentials)
        const latest = verRes.data[0]
        const cRes = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`, noCredentials)
        manualChampions.value = Object.values(cRes.data.data).map(c => c.name).sort()
      } catch (e) {
        console.error('DDragon champion fetch error:', e)
      }
    })

    const submitManual = async () => {
      loading.value = true; statusMsg.value = ''
      try {
        const res = await axios.post(`${API}/matches/manual`, {
          matchIdLCC:   manual.value.matchIdLCC,
          season:       manual.value.season,
          gameDuration: manual.value.gameDurationMins * 60 + manual.value.gameDurationSecs,
          gameVersion:  manual.value.gameVersion,
          blueTeamName: manual.value.blue.name,
          blueWon:      manual.value.blue.won,
          redTeamName:  manual.value.red.name,
          bluePlayers:  manual.value.blue.players,
          redPlayers:   manual.value.red.players,
          password:     password.value,
        })
        statusMsg.value = res.data.message; isError.value = false
      } catch (e) {
        statusMsg.value = e.response?.data?.message ?? 'Error creating match.'
        isError.value = true
      } finally { loading.value = false }
    }

    // ── MVP tab ───────────────────────────────────────────────
    const mvp = ref({
      matchIdLCC: '', loadingPlayers: false, loadError: '',
      matchName: '', currentMvp: '', players: [], selectedPuuid: '',
    })

    const loadMvpMatch = async () => {
      if (!mvp.value.matchIdLCC) return
      mvp.value.loadingPlayers = true
      mvp.value.loadError = ''; mvp.value.players = []
      mvp.value.matchName = ''; mvp.value.currentMvp = ''; mvp.value.selectedPuuid = ''
      try {
        const res = await axios.get(`${API}/matches/lcc/${mvp.value.matchIdLCC}`)
        const data = res.data.data
        if (!data) { mvp.value.loadError = 'Match not found.'; return }
        mvp.value.matchName  = data.metadata?.matchName ?? ''
        mvp.value.currentMvp = data.metadata?.mvp?.playerName ?? ''
        if (data.metadata?.mvp?.puuid) mvp.value.selectedPuuid = data.metadata.mvp.puuid
        const players = []
        for (const team of data.info?.teams ?? []) {
          for (const p of team.players ?? []) {
            players.push({
              puuid:    p.profile?.puuid ?? '',
              name:     p.profile?.name  ?? '',
              champion: p.champion?.name ?? '',
              team:     team.name,
              kills: p.kills, deaths: p.deaths, assists: p.assists,
              kda: p.kda, dmg: p.dmg,
            })
          }
        }
        mvp.value.players = players
      } catch {
        mvp.value.loadError = 'Failed to load match. Check the ID.'
      } finally { mvp.value.loadingPlayers = false }
    }

    const submitMvp = async () => {
      loading.value = true; statusMsg.value = ''
      const selected = mvp.value.players.find(p => p.puuid === mvp.value.selectedPuuid)
      try {
        const res = await axios.patch(`${API}/matches/lcc/${mvp.value.matchIdLCC}/mvp`, {
          puuid:      selected.puuid,
          playerName: selected.name,
          password:   password.value,
        })
        statusMsg.value = res.data.message; isError.value = false
        mvp.value.currentMvp = selected.name
      } catch (e) {
        statusMsg.value = e.response?.data?.message ?? 'Error assigning MVP.'
        isError.value = true
      } finally { loading.value = false }
    }

    // ── Init ──────────────────────────────────────────────────
    axios.get(`${API}/matches/seasons`).then(r => { seasons.value = r.data }).catch(() => {})

    return {
      tabs, activeTab, password, isError, statusMsg, loading, seasons,
      add, addTeams, submitAdd,
      refreshErrors, submitRefresh,
      manual, manualTeams, manualPlayers, manualChampions, submitManual,
      mvp, loadMvpMatch, submitMvp,
    }
  }
}
</script>

<style scoped>
.field-label {
  @apply block text-sm font-medium text-gray-300 mb-1;
}
.field-input {
  @apply w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none;
}
</style>