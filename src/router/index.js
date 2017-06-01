import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'

import User from '@/views/user/User'
import Address from '@/views/user/Address'
import Cart from '@/views/user/Cart'

import MallComment from '@/views/mall/MallComment'
import MallItem from '@/views/mall/MallItem'
import MallOrder from '@/views/mall/MallOrder'
import MallReturnGoods from '@/views/mall/MallReturnGoods'
import MallSet from '@/views/mall/MallSet'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    }, {
      path: '/home',
      name: 'Home',
      meta: {
        requireAuth: true,
      },
      component: Home,
      children: [
        // User
        {
          path: '/user',
          name: 'User',
          meta: {
            requireAuth: true,
          },
          component: User,
        }, {
          path: '/user/address',
          name: 'Address',
          meta: {
            requireAuth: true,
          },
          component: Address,
        }, {
          path: '/user/cart',
          name: 'Cart',
          meta: {
            requireAuth: true,
          },
          component: Cart,
        },

        // Mall
        {
          path: '/mall/comment',
          name: 'MallComment',
          meta: {
            requireAuth: true,
          },
          component: MallComment,
        },
        {
          path: '/mall/item',
          name: 'MallItem',
          meta: {
            requireAuth: true,
          },
          component: MallItem,
        },
        {
          path: '/mall/order',
          name: 'MallOrder',
          meta: {
            requireAuth: true,
          },
          component: MallOrder,
        },
        {
          path: '/mall/returnGoods',
          name: 'MallReturnGoods',
          meta: {
            requireAuth: true,
          },
          component: MallReturnGoods,
        },
        {
          path: '/mall/set',
          name: 'MallSet',
          meta: {
            requireAuth: true,
          },
          component: MallSet,
        },
      ]
    }
  ]
})
