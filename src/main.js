// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import vueInfiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import Vuex from "vuex"

import "./assets/css/base.css";
import "./assets/css/product.css";
import "./assets/css/supply.css";
import "./assets/css/login.css";
import "./assets/css/checkout.css";
 
Vue.use(VueLazyload,{
  loading: '/static/loading-svg/loading-bars.svg',
})

Vue.use(vueInfiniteScroll)

Vue.filter('currency',currency)

Vue.config.productionTip = false

Vue.use(Vuex);

// vuex
const store = new Vuex.Store({
  state: {
    nickName:'',
    cartCount:0
  },
  mutations: {
    updateUserInfo(state,nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount) {
      state.cartCount = cartCount;
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
