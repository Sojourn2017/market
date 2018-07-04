<template>
  <div>
    <!-- 网页头部 -->
    <nav-header></nav-header>

    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>购物流程</span></h2>
      </div>
      <!-- 购物流程-->
      <div class="check-step">
        <ul>
          <li class="cur"><span>确认</span> 地址</li>
          <li class="cur"><span>核对</span> 订单</li>
          <li class="cur"><span>支付</span> 订单</li>
          <li class="cur"><span>交易</span> 完成</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img v-bind:src="`static/img/${resultImg}`" alt=""></div>
        <div class="order-create-main">
          <h3>{{resultMsg}}</h3>
          <p>
            <span>订单号：{{orderId}}</span>
            <span>付款金额：{{orderPrice}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m" to="/cart">去购物车</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m" to="/goods">继续购物</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 网页底部 -->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from './../components/Navheader.vue'
import NavFooter from './../components/NavFooter.vue'
import NavBread from './../components/NavBread.vue'
import Modal from './../components/Modal.vue'
import SvgModel from './../components/SvgModel.vue'
import axios from 'axios'

export default {
  data () {
    return {
      resultImg:"",   // 订单结果图片    
      resultMsg:"",    // 订单结果信息
      orderId:"",   // 订单ID
      orderPrice:0    // 订单金额
    } ; 
  },

  components:{
    NavHeader,
    NavFooter,
    NavBread,
    Modal,
    SvgModel
  },

  mounted() {
    let orderId = this.$route.query.orderId;
    if (!orderId) {
      return;
    }
    axios.get("/users/orderDetail",{
      params:{
        orderId:orderId,
      }
    }).then((response) => {
      let res = response.data;
      if (res.status == "0") {
        this.resultImg = "ok-2.png";
        this.resultMsg = "下单成功!";
        this.orderId = res.result.orderId;
        this.orderPrice = res.result.orderPrice;
      } else {
        this.resultImg = "error-1.png";
        this.resultMsg = "下单错误!";
      }
    })
  }
}

</script>