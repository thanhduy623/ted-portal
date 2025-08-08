import { createRouter, createWebHistory } from 'vue-router'

import defaultLayout from '@/layouts/defaultLayout.vue'

import HomePage from '@/views/HomeView.vue'
import AboutPage from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'

import YearView from '@/views/YearView.vue'
import GenerationView from '@/views/GenerationView.vue'

import TeddyView from '@/views/TeddyView.vue'
import AddTeddy from '@/views/AddTeddy.vue'
import UpdateTeddy from '@/views/UpdateTeddy.vue'

import EventView from '@/views/EventView.vue'
import AddEvent from '@/views/AddEvent.vue'
import UpdateEvent from '@/views/UpdateEvent.vue'

import MistakeView from '@/views/MistakeView.vue'
import ShiftView from '@/views/ShiftView.vue'
import AuthLayout from '@/layouts/authLayout.vue'


const routes = [
  {
    path: '/',
    component: defaultLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'about', component: AboutPage },

      { path: 'year', component: YearView },
      { path: 'generation', component: GenerationView },
      { path: 'department', component: HomePage },

      { path: 'teddy', component: TeddyView },
      { path: 'teddy/add', component: AddTeddy },
      { path: 'teddy/edit/:id', component: UpdateTeddy },

      { path: 'event', component: EventView },
      { path: 'event/add', component: AddEvent },
      { path: 'event/edit/:id', component: UpdateEvent },

      { path: 'mistake', component: MistakeView },
      { path: 'shift', component: ShiftView },
    ]
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      { path: '', component: LoginView }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
