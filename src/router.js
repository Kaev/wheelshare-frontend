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

export default router
