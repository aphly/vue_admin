import { createRouter, createWebHistory } from 'vue-router'
import { useManagerStore } from '@/stores/manager'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin/login',
      name: 'login',
      component: () => import('../views/admin/account/login.vue'),
    },
    {
      path: '/admin/select_role',
      name: 'select_role',
      component: () => import('../views/admin/account/select_role.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/layout',
      name: 'layout',
      component: () => import('../views/admin/account/layout.vue'),
      meta: { requiresAuth: true },
      children:[
        {
          path: '/admin/account/index',
          name: 'index',
          component: () => import('../views/admin/account/index.vue'),
          meta: { requiresAuth: true }
        },
      ]
    },
  ],
})

router.beforeEach((to, from,next) => {
  const manager = useManagerStore()
  if(to.path=='/admin/login' && manager.loginStatus){
    next({
      path: '/admin/select_role'
    })
  }else{
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if(!manager.loginStatus){
        next({
          path: '/admin/login',
          query: { redirect: to.fullPath }
        })
      }else{
        next()
      }
    }else{
      next()
    }
  }
})

export default router
