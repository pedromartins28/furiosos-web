import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { supabase } from '../boot/supabase' // Certifique-se de que esse caminho está correto

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()
  const isAuthenticated = !!data.session

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
  } else {
    next()
  }
})

export default router
