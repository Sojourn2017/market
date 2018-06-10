import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/GoodsList'
import Carts from '@/views/Carts'

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
      path:'/carts',
      name:'Carts',
      component:Carts
    }
  ]
})
