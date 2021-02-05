import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/dashboard'
import CustomOrder from '@/components/customOrder'
import CustomOrderCheck from '@/components/customOrder_check'
import login from '@/components/pages/login'
import Product from '@/components/pages/product'
import Orders from '@/components/pages/orders'
import Coupon from '@/components/pages/coupon'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect:{
        path: '/login',
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children:[
        {
          path: 'product',
          name: 'Products',
          component: Product,
          meta: { requiresAuth: true }
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true }
        },
        {
          path: 'coupon',
          name: 'Coupon',
          component: Coupon,
          meta: { requiresAuth: true }
        },
      ],
    },
    {
      path: '/',
      name: 'Dashboards',
      component: Dashboard,
      children:[
        {
          path: 'custom_order',
          name: 'CustomOrder',
          component: CustomOrder,
        },
        {
          path: 'custom_order_check/:order_id',
          name: 'custom_order_check',
          component: CustomOrderCheck,
        },
      ],
    },
  ]
})
