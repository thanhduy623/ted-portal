import { createRouter, createWebHashHistory } from 'vue-router'
import { sessionGet } from '@/utils/sessionStore'

// Layout
import defaultLayout from '@/layouts/defaultLayout.vue'
import AuthLayout from '@/layouts/authLayout.vue'

// Home + auth
import NotFound from '@/views/NotFound.vue'
import HomePage from '@/views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import PersonalView from '@/views/auth/PersonalView.vue'


import YearView from '@/views/YearView.vue'
import GenerationView from '@/views/GenerationView.vue'

// Teddy
import TeddyView from '@/views/teddy/TeddyView.vue'


// Event
import EventView from '@/views/event/EventView.vue'


// Statistics
import StatisticsView from '@/views/statistics/StatisticsView.vue'


const routes = [
  {
    path: '/',
    component: defaultLayout,
    children: [
      { path: '', component: HomePage },
      { path: '/personal', component: PersonalView },

      { path: 'year', component: YearView },
      { path: 'generation', component: GenerationView },
      { path: 'department', component: HomePage },

      { path: 'teddy', component: TeddyView },

      { path: 'event', component: EventView },

      { path: 'statistics', component: StatisticsView },
    ]
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      { path: '', component: LoginView }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
]


// Định tuyến đường dẫn tanh
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})



// Bảo vệ yêu cầu token
router.beforeEach((to, from, next) => {
  const token = sessionGet("token")
  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})


export default router
