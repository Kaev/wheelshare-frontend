import { createRouter, createWebHistory } from 'vue-router'
import WheelCreate from './components/WheelCreate.vue'
import WheelRoom from './components/WheelRoom.vue'

const routes = [
  { path: '/', component: WheelCreate },
  { path: '/wheel/:id', component: WheelRoom, props: true }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Handle GitHub Pages SPA fallback with ?redirect= param
router.beforeEach((to, from, next) => {
  const redirect = to.query.redirect
  if (redirect) {
    next(redirect)
  } else {
    next()
  }
})

export default router
