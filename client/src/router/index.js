import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/pages/login'
import prepairing from '@/components/pages/prepairing'
import game from '@/components/pages/game'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'prepairing',
      component: prepairing,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/game',
      name: 'game',
      component: game,
      meta: {
        requiresAuth: true
      }
    }
  ]
})
