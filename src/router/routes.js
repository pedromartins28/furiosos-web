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
      },
      {
        path: '/ao-vivo',
        component: () => import('pages/TwitchLivePage.vue')
      },
      {
        path: '/loja',
        component: () => import('pages/LojaPage.vue')
      },
      {
        path: '/missoes',
        component: () => import('pages/MissoesPage.vue')
      },
      {
        path: '/validar',
        component: () => import('pages/ValidarPerfilPage.vue')
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
      }
    ]
  },
  {
    path: '/politica',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: () => import('pages/PoliticaPrivacidade.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
