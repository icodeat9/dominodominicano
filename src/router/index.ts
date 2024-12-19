import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '@/pages/SignIn.vue'
import DominoLobby from '@/pages/DominoLobby.vue'
import { useUserStore } from '@/store/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SignIn,
    },
    {
      path: '/lobby',
      name: 'DominoLobby',
      component: DominoLobby,
    },
    {
      path: '/game/:gameId',
      name: 'GameTable',
      component: () => import('@/pages/GameTable.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.userToken && to.name !== 'home') {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
