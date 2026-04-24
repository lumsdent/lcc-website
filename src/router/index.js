import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/match',
      name: 'match',
      component: () => import('../views/MatchFormView.vue')
    },
    {
      path: '/matches',
      name: 'matches',
      component: () => import('../views/MatchView.vue')
    },
    {
      path: '/match/:matchId',
      name: 'matchDetail',
      component: () => import('../views/MatchDetail.vue')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/RegistrationView.vue')
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('../views/ScheduleView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/stats',
      name: 'statsOverview',
      component: () => import('../views/StatsOverviewView.vue')
    },
    {
      path: '/stats/player',
      name: 'stats',
      component: () => import('../views/StatsView.vue')
    },
    {
      path: '/stats/champion',
      name: 'championStats',
      component: () => import('../views/ChampionStatsView.vue')
    },
    {
      path: '/players/:puuid',
      name: 'PlayersView',
      component: () => import('../views/PlayerView.vue'),
      props: true
    },
    {
      path: '/standings',
      name: 'standings',
      component: () => import('../views/StandingsView.vue')
    },
    {
      path: '/teams',
      name: 'teams',
      component: () => import('../views/TeamsView.vue')
    },
    {
      path: '/teams/:teamId',
      name: 'teamDetail',
      component: () => import('../views/TeamDetailView.vue'),
      props: true
    },
    {
      path: '/players',
      name: 'players',
      component: () => import('../views/PlayersView.vue')
    },
    {
      path: '/patchnotes',
      name: 'patchnotes',
      component: () => import('../views/PatchNotesView.vue')
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('../views/PracticeView.vue')
    },
    {
      path: '/tournament',
      name: 'tournament',
      component: () => import('../views/TournamentView.vue')
    },
    {
      path: '/art',
      name: 'art',
      component: () => import('../views/ArtGalleryView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/claim-profile',
      name: 'claimProfile',
      component: () => import('../views/ClaimProfileView.vue')
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
