const routes = [
  {
    path: '/',
    redirect: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: 'login', component: () => import('pages/LoginPage.vue') }],
  },

  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
