// src/router/routes.js
import MainLayout from 'layouts/MainLayout.vue'
import AuthPage from 'pages/AuthPage.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/HomePage.vue')
      },
      {
        path: 'cadastro',
        component: () => import('pages/CadastroPage.vue')
      },
      {
        path: 'interesses',
        component: () => import('pages/InteressesPage.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: MainLayout,
    children: [
      {
        path: '',
        component: AuthPage
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
