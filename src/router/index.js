import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Auth/Login.vue'
import Register from '@/views/Auth/Register.vue'
import ForgotPassword from '@/views/Auth/ForgotPassword.vue'
import Dashboard from '@/views/Dashboard.vue'
import TripDetail from '@/views/TripDetail.vue'
import PlaceSearch from '@/views/PlaceSearch.vue'
import PlaceDetail from '@/views/PlaceDetail.vue'
import ShareTrip from '@/views/ShareTrip.vue'
import ExportPanel from '@/views/ExportPanel.vue'
import Notifications from '@/views/Notifications.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/trips/:tripId', name: 'TripDetail', component: TripDetail, props: true },
  { path: '/places/search', name: 'PlaceSearch', component: PlaceSearch },
  { path: '/places/:placeId', name: 'PlaceDetail', component: PlaceDetail, props: true },
  { path: '/share/:shareId', name: 'ShareTrip', component: ShareTrip, props: true },
  { path: '/export/:tripId', name: 'ExportPanel', component: ExportPanel, props: true },
  { path: '/notifications', name: 'Notifications', component: Notifications },
  { path: '/profile', name: 'Profile', component: Profile },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
