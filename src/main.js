// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import vueInfiniteScroll from 'vue-infinite-scroll'
 
Vue.use(VueLazyload,{
  loading: '/static/loading-svg/loading-bars.svg',
})

Vue.use(vueInfiniteScroll)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
