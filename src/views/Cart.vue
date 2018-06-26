<template>
  <div>
    <!-- 网页头部 -->
    <nav-header></nav-header>

    <!-- 网页面包屑 -->
    <nav-bread>
      <span slot="bread">购物车</span>
    </nav-bread>

    <!-- svg图标库 -->
    <svg-model></svg-model>

    <!-- 购物车主体 -->
    <div class="container">
      <div class="cart">

        <!-- 购物车标题 -->
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>我的购物车</span></h2>
        </div>

        <!-- 购物车列表 -->
        <div class="item-list-wrap">
          <div class="cart-item">

            <!-- 表头 -->
            <div class="cart-item-head">
              <ul>
                <li>商品</li>
                <li>单价</li>
                <li>数量</li>
                <li>总价</li>
                <li>删除</li>
              </ul>
            </div>

            <!-- 列表详情 -->
            <ul class="cart-item-list">
              <li v-for="item in cartList">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked}" @click="editCart('checked',item)">
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-bind:src="`static/img/${item.productImage}`">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" v-on:click="editCart('minus',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" v-on:click="editCart('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.salePrice*item.productNum}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" v-on:click="delConfirm(item.productId)">
                      <svg class="icon icon-del">
                        <use xlink:href="#icon-del"></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 购物车汇总 -->
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;" v-on:click="selectAll()">
                      <span class="checkbox-btn item-check-btn" v-bind:class="{'check':selectAllFlag}" >
                          <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                      </span>
                  <span>全选</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                合计: <span class="total-price">{{totalPrice}}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" href="/#/trade">去结算</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除商品确认模态框 -->
    <model v-bind:mdShow="mdShowDel" v-on:close="closeModel">
      <p slot="message">确定要删除吗？
      </p>
      <div slot="btnGroup" class="btn-wrap">
        <a class="btn btn--m" href="javascript:;" v-on:click="productDel()">确定</a>
        <a class="btn btn--m" href="javascript:;">取消</a>
      </div>
    </model>

    <!-- 网页底部 -->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import './../assets/css/checkout.css'
import './../assets/css/login.css';
import NavHeader from './../components/Navheader.vue'
import NavFooter from './../components/NavFooter.vue'
import NavBread from './../components/NavBread.vue'
import Model from './../components/Model.vue'
import SvgModel from './../components/SvgModel.vue'
import axios from 'axios'

export default {
  data () {
    return {
      mdShowDel:false,    // 模态框状态
      productDelId:"",    // 欲删除的商品ID
      cartList:[]    // 购物车列表
    } ; 
  },
  computed:{
    selectAllFlag() {    //全选信号
      return this.cartList.length == this.checkedCount;
    },
    checkedCount() {    //选中商品的数量
      let count = 0;
      this.cartList.forEach((item) => {
        if (item.checked) {count++};
      })
      return count;
    },
    totalPrice() {    // 实时计算总价
      let money = 0;
      this.cartList.forEach((item)=>{
        if (item.checked) {
          money += item.productNum * item.salePrice;
        }
      });
      return money;
    }
  },
  mounted() {
    this.init();  // 初始化
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Model,
    SvgModel
  },
  methods: {
    // 初始化函数
    init() {
      axios.get("./users/cartList").then((response)=>{
        let res = response.data;
        if (res.status == "0") {
          this.cartList = res.result;
        } else {
          this.cartList = [];
        }
      })
    },

    // 弹出删除确认模态框
    delConfirm(productId) {
      this.productDelId = productId;
      this.mdShowDel = true;
    },

    // 删除指定商品
    productDel() {
      axios.post("./users/productDel",{productId:this.productDelId}).then((response)=>{
        let res = response.data;
        if (res.status == "0") {
          this.mdShowDel = false;
          this.updateCartList(this.productDelId);
          this.productDelId = "";
        } else {
          // 删除失败
        }
      })
    },

    // 更新购物车列表，删除Id为参数的商品
    updateCartList(productId) {
      let cartList = this.cartList;
      for (let item in cartList) {
        if (cartList[item].productId == productId) {
          cartList.splice(item,1);
          return;
        }
      }
      this.cartList = cartList;
    },

    // 关闭模态框
    closeModel() {
      this.mdShowDel = false;
    },

    // 修改购物车商品数量或选中状态
    editCart(flag,item) {
      switch (flag) {
        case "minus":
          if (item.productNum <= 1) {
            return;
          }
          item.productNum--;
          break;
        
        case "add":
          item.productNum++;
          break;

        case "checked":
          item.checked = !item.checked;
      }

      // 向后台发送更改的数据
      axios.post("./users/editCart",{
        productId:item.productId,
        productNum:item.productNum,
        checked:item.checked
      }).then((response) => {
          let res = response.data;
          // 响应处理
      })
    },

    // 设置全选
    selectAll() {
      let flag = !this.selectAllFlag;
      this.cartList.forEach((item) => {
        item.checked = flag;
      });

      // 向后台发送全选信号
      axios.post("./users/selectAll",{selectAllFlag:flag}).then((response) => {
        let res = response.data;
        // 响应处理
      });
    }
  }
}

</script>