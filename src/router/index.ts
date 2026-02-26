import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import BlogsView from "@/views/BlogsView.vue"
import BlogCreateView from "@/views/BlogCreateView.vue"
import SignUpView from "@/views/auth/SignUpView.vue";


const baseUrl = import.meta.env.BASE_URL || '/'

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignUpView },
    { path: '/blogs', name: 'blogs', component: BlogsView, meta: { requiresAuth: true } },
    { path: '/blog/create', name: 'blogCreate', component: BlogCreateView, meta: { requiresAuth: true } },
  ],
})

// Navigation Guard
router.beforeEach((to, _from, next) => {
  const isAuthenticated = !!localStorage.getItem('accessToken')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' })
  }
  next()
})

export default router