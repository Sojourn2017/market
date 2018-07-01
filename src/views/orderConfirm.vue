<template>
  <div>
  <!-- 网页头部 -->
  <nav-header  v-on:overLoad="init"></nav-header>

  <!-- svg图标库 -->
  <svg-model></svg-model>

  <!-- 核对订单页面 -->
  <div>
    <div class="container">
      <div class="checkout-order">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>购物流程</span></h2>
        </div>
        <!-- 购物流程-->
        <div class="check-step">
          <ul>
            <li class="cur"><span>确认</span> 地址</li>
            <li class="cur"><span>核对</span> 订单</li>
            <li><span>支付</span> 订单</li>
            <li><span>交易</span> 完成</li>
          </ul>
        </div>

        <!-- 订单列表 -->
        <div class="page-title-normal checkout-title">
          <h2><span>订单信息</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>商品名称</li>
                <li>单价</li>
                <li>数量</li>
                <li>总价</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in orderList">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img v-bind:src="`static/img/${item.productImage}`" alt="picture">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{(item.salePrice) | currency('￥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">{{item.productNum}}</span>
                      </div>
                    </div>
                    <div class="item-stock item-stock-no">现货</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{(item.salePrice*item.productNum) | currency('￥')}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 订单价格 -->
        <div class="price-count-wrap">
          <div class="price-count">
            <ul>
              <li>
                <span>商品总金额:</span>
                <span>{{(totalPrice) | currency('￥')}}</span>
              </li>
              <li>
                <span>运费:</span>
                <span>{{(orderShipping) | currency('￥')}}</span>
              </li>
              <li>
                <span>折扣:</span>
                <span>{{(orderDiscount) | currency('￥')}}</span>
              </li>
              <li class="order-total-price">
                <span>实付款:</span>
                <span>{{(totalPay) | currency('￥')}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">
            <router-link class="btn btn--m" to="/address">上一步</router-link>
          </div>
          <div class="next-btn-wrap">
            <button class="btn btn--m btn--red" v-on:click="submitOrder">提交订单</button>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- 网页底部 -->
  <nav-footer></nav-footer>
  </div>
</template>

<style>
</style>

<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import './../assets/css/checkout.css'
import './../assets/css/login.css';
import NavHeader from './../components/Navheader.vue'
import NavFooter from './../components/NavFooter.vue'
import NavBread from './../components/NavBread.vue'
import Modal from './../components/Modal.vue'
import SvgModel from './../components/SvgModel.vue'
import axios from 'axios'

export default {
  data () {
    return {
      orderList:[],   // 订单列表
      orderShipping:100,    // 运费
      orderDiscount:0,    // 折扣
      totalPrice:0,   // 商品总金额
      totalPay:0,    // 实际支付金额
    } ; 
  },

  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal,
    SvgModel
  },

  computed:{
  },

  mounted() {
    this.init();
  },

  methods:{
    // 初始化获取订单商品列表
    init() {
      axios.get("/users/orderList").then((response) => {
        let res = response.data;
        if (res.status == "0") {
          this.orderList = res.result;
          this.orderList.forEach((item)=>{
            this.totalPrice += item.productNum * item.salePrice;
          });
          this.totalPay = this.totalPrice + this.orderShipping - this.orderDiscount > 0
            ? this.totalPrice + this.orderShipping - this.orderDiscount
            : 0;
        }
      })
    },

    // 提交订单
    submitOrder() {
      let addressId = this.$route.query.addressId;
      axios.post("/users/payMent",{
        addressId:addressId,
        totalPay:this.totalPay
      }).then((response) => {
        let res = response.data;
        if (res.status == "0") {
          this.$router.push({
          path:'/orderSuccess',
          query:{
            address:res.result.orderId
          }
        })
        }
      })
    }
  }
}

</script>