<template>
  <div>
  <!-- 网页头部 -->
  <nav-header  v-on:overLoad="init"></nav-header>

  <!-- svg图标库 -->
  <svg-model></svg-model>

  <!-- 结算地址页面 -->
  <div class="checkout-page">
    <div class="container">
      <div class="checkout-addr">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>结算</span></h2>
        </div>
        <!-- 购物流程 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>确认</span> 地址</li>
            <li><span>核对</span> 订单</li>
            <li><span>支付</span> 订单</li>
            <li><span>交易</span> 完成</li>
          </ul>
        </div>

        <!-- 地址列表 -->
        <div class="page-title-normal checkout-title">
          <h2><span>收货地址</span></h2>
        </div>
        <div class="addr-list-wrap">
          <div class="addr-list">
            <ul>
              <li v-for="(item,index) in addressListFilter" 
                  v-bind:class="{'check':checkIndex==index}" 
                  v-on:click="checkIndex=index;selectAddressId=item.addressId">
                <dl>
                  <dt>{{item.userName}}</dt>
                  <dd class="address">{{item.streetName}}</dd>
                  <dd class="tel">{{item.tel}}</dd>
                </dl>
                <div class="addr-opration addr-del">
                  <a href="javascript:;" class="addr-del-btn" v-on:click="addressDelConfirm(item.addressId)">
                    <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
                  </a>
                </div>
                <div class="addr-opration addr-set-default">
                  <a href="javascript:;" class="addr-set-default-btn" v-if="!item.isDefault" v-on:click="setDefault(item.addressId)"><i>设为默认</i></a>
                </div>
                <div class="addr-opration addr-default" v-if="item.isDefault">默认地址</div>
              </li>
              <li class="addr-new">
                <div class="add-new-inner">
                  <i class="icon-add">
                    <svg class="icon icon-add"><use xlink:href="#icon-add"></use></svg>
                  </i>
                  <p>添加新地址</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="shipping-addr-more">
            <a class="addr-more-btn up-down-btn" 
                href="javascript:;" 
                v-on:click="showMoreAddress" 
                v-bind:class="{'open':addressCountLimit>3}">
              <span v-text="showMoreAddressText"></span>
              <i class="i-up-down">
                <i class="i-up-down-l"></i>
                <i class="i-up-down-r"></i>
              </i>
            </a>
          </div>
        </div>

        <!-- 配送方式-->
        <div class="page-title-normal checkout-title">
          <h2><span>配送方式</span></h2>
        </div>
        <div class="lemall-msg-info hidden">
          <span>您选择的地址不在我们的配送区域内。请在我们的配送区域内选择另一个发货地址。</span>
        </div>
        <div class="shipping-method-wrap">
          <div class="shipping-method">
            <ul>
              <li class="check">
                <div class="name">标准配送</div>
                <div class="price">无运费</div>
                <div class="shipping-tips">
                  <p>订单将在发货后1-7个工作日到达目的地。</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="next-btn-wrap">
          <a class="btn btn--m btn--red" v-bind:class="{'btn--dis':selectAddressId==''}" v-on:click="nextStep">下一步</a>
        </div>
      </div>
    </div>
  </div>

  <!-- 模态框 -->
  <modal  v-bind:mdShow="mdShowDel" v-on:close="closeModal">
    <p slot="message">
      您是否确认删除此地址？
    </p>
    <div slot="btnGroup" class="btn-wrap">
       <a class="btn btn--m" href="javascript:;" v-on:click="addressDel">确定</a>
        <a class="btn btn--m" href="javascript:;" v-on:click="closeModal">取消</a>
    </div>
  </modal>

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
      addressCountLimit:3,    // 显示地址数量
      addressList:[],    // 收货地址列表
      checkIndex:0,    // 选中地址的索引
      mdShowDel:false,    // 删除地址模态框显示标志
      addressDelId:"",    // 要删除的地址ID
      selectAddressId:"",    // 选中地址的ID
    } ; 
  },

  computed: {
    addressListFilter() {   // 限制显示的地址数
      return this.addressList.slice(0,this.addressCountLimit);
    },
    showMoreAddressText() {   // 显示更多地址标志
      return this.addressListFilter.length < this.addressList.length
        ? "更多"
        : ""     
    }
  },

  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal,
    SvgModel
  },

  mounted() {
    this.init();
  },

  methods: {
    // 页面初始化 加载地址列表
    init() {
      this.selectAddressId = "";    // 初始化选中地址的ID
      axios.get("/users/addressList").then((response)=>{
        let res = response.data;
        if (res.status == "0") {
          let list = res.result.slice(0);
          list.sort((a,b) => {
            return b.isDefault - a.isDefault;
          })
          if (list.length) {    // 设置默认地址ID为选中地址的ID
            this.selectAddressId = list[0].isDefault 
              ? list[0].addressId 
              : "";
          }
          this.addressList = list;
        } else {
          this.addressList = [];
        }
      })
    },

    // 显示更多地址
    showMoreAddress() {
      if (this.addressCountLimit == 3) {
        this.addressCountLimit = this.addressList.length;
      } else {
        this.addressCountLimit = 3;
      }
    },

    // 设为默认地址
    setDefault(addressId) {
      axios.post("/users/setDefault",{
        addressId:addressId
      }).then((response)=>{
        let res = response.data;
        if(res.status == '0') {
          let list = this.addressList;
          list.forEach((item) => {
            if (item.addressId == addressId) {
              item.isDefault = true;
            } else {
              item.isDefault = false;
            }
          });
        }
      })
    },

    // 关闭模态框
    closeModal() {
      this.mdShowDel = false;
    },

    // 弹出删除地址确认模态框
    addressDelConfirm(addressId) {
      this.addressDelId = addressId;
      this.mdShowDel = true;
    },

    // 删除地址
    addressDel() {
      axios.post("/users/addressDel",{addressId:this.addressDelId}).then((response)=>{
        let res = response.data;
        if (res.status == "0") {
          this.mdShowDel = false;
          this.updateAddressList(this.addressDelId);
          this.productDelId = "";
        } else {
          console.error("删除失败");
        }
      })
    },

    // 更新地址列表，删除Id为参数的地址
    updateAddressList(addressId) {
      let addressList = this.addressList;
      for (let item in addressList) {
        if (addressList[item].addressId == addressId) {
          addressList.splice(item,1);
          return;
        }
      }
    },

    // 判断是否可以跳转核对订单页面(既选择地址又选择配送方式)
    nextStep() {
      if (this.selectAddressId) {
        this.$router.push({
          path:'/orderConfirm',
          query:{
            addressId:this.selectAddressId
          }
        })
      }
    }

  }
}

</script>