import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/match',
      name: 'match',
      component: () => import('../views/MatchFormView.vue')
    },
    {
      path: '/match/:matchId',
      name: 'matchDetail',
      component: () => import('../views/MatchDetail.vue'),
    },
    {
      path: '/draft',
      name: 'draft',
      component: () => import('../views/DraftView.vue')
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
      path: '/practice',
      name: 'practice',
      component: () => import('../views/PracticeView.vue')
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
    }
  ]
})

export default router
