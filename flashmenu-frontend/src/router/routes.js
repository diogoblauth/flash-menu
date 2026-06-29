const routes = [
  { path: '/', redirect: '/login' },

  // Páginas de autenticação — redireciona para /dashboard se já logado
  {
    path: '/login',
    meta: { isPublicOnly: true },
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/LoginPage.vue') }],
  },
  {
    path: '/cadastro',
    meta: { isPublicOnly: true },
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/RegisterPage.vue') }],
  },

  // Painel administrativo — requer autenticação
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('pages/admin/DashboardPage.vue') },
      { path: 'categorias', component: () => import('pages/admin/CategoriesPage.vue') },
      { path: 'itens', component: () => import('pages/admin/ItemsPage.vue') },
      { path: 'configuracoes', component: () => import('pages/admin/ProfilePage.vue') },
    ],
  },

  // 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
