import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ScheduleView.vue')
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
      name: 'stats',
      component: () => import('../views/StatsView.vue')
    },
    {
      path: '/players/:puuid',
      name: 'PlayersView',
      component: () => import('../views/PlayerView.vue'),
      props: true
    },
    {
      path: '/teams',
      name: 'teams',
      component: () => import('../views/TeamsView.vue')
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
