import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import Trade from "@/views/Trade"
import orderConfirm from "@/views/orderConfirm"
import orderSuccess from "@/views/orderSuccess"

Vue.use(Router)

export default new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path:'/cart',
      name:'Cart',
      component:Cart
    },
    {
      path:'/address',
      name:'Address',
      component:Address
    },
    {
      path:'/trade',
      name:'Trade',
      component:Trade
    },
    {
      path:'/orderConfirm',
      name:'orderConfirm',
      component:orderConfirm
    },
    {
      path:'/orderSuccess',
      name:'orderSuccess',
      component:orderSuccess
    },
  ]
})
