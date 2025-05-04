// src/router/routes.js
import MainLayout from 'layouts/MainLayout.vue'
import AuthLayout from 'layouts/AuthLayout.vue'
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
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: AuthPage
      },
      {
        path: 'redirect',
        component: () => import('pages/AuthRedirect.vue')
      }
    ]
  },
  {
    path: '/cadastro',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: () => import('pages/CadastroPage.vue')
      },
      {
        path: '/politica',
        component: () => import('pages/PoliticaPrivacidade.vue')
      }
      
    ]
  },
  {
    path: '/auth/redirect',
    component: () => import('pages/AuthRedirect.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]


export default routes
