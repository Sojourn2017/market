import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/GoodsList'
import Cart from '@/views/Cart'
import Trade from "@/views/Trade"

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
      path:'/trade',
      name:'Trade',
      component:Trade
    }
  ]
})
