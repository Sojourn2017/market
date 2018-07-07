<template>
  <div>
    <!-- 网页头部 -->
    <nav-header v-on:overLoad="init"></nav-header>

    <!-- 网页面包屑 -->
    <nav-bread>
      <span slot="bread">商品</span>
    </nav-bread>

    <!-- 商城首页 -->
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">排序：</span>
          <a class="order-Rise" href="javascript:void(0)"
              v-bind:class="{'cur':sortFlag==true}" v-on:click="sortGoodsList(true)">
            升序
          </a>
          <a class="order-decline" href="javascript:void(0)"
              v-on:click="sortGoodsList(false)" v-bind:class="{'cur':sortFlag==false}">
            降序
          </a>
          <a class="filterby stopPop" href="javascript:void(0)" 
              v-on:click="showFilterPop">
            筛选
          </a>
        </div>

        <div class="accessory-result">
        <!-- 价格筛选 -->
          <div class="filter stopPop" id="filter" 
                v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>价格:</dt>
              <dd>
                <a href="javascript:void(0)" 
                    v-bind:class="{'cur':priceChecked=='all'}" @click="chooseAll()">
                  所有
                </a>
              </dd>
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)" 
                    @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">
                  {{price.startPrice}}-{{price.endPrice}}
                </a>
              </dd>
            </dl>
          </div>
            
          <!-- 商品列表 -->
          <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="item in goodsList">
                <div class="pic">
                  <a href="javascript:void(0)">
                    <img v-bind:src="`static/img/${item.productImage}`" v-bind:alt="`${item.productName}`">
                  </a>
                </div>
                <div class="main">
                  <div class="name">{{item.productName}}</div>
                  <div class="price">{{item.salePrice}}</div>
                  <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
            <div class="load-more" 
                  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
              <img src="static/loading-svg/loading-spinning-bubbles.svg" v-show="loadMoreFlag">
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>

    <!-- 模态框-未登录加入购物车 -->
    <modal v-bind:mdShow="mdShowLogin" v-on:close="closeModel">
      <p slot="message">
        请先登录，否则无法加入到购物车！
      </p>
      <div slot="btnGroup" class="btn-wrap">
        <a class="btn btn--m" href="javascript:;" @click="mdShowLogin=false">关闭</a>
      </div>
    </modal>

    <!-- 模态框-成功加入购物车 -->
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModel">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入成功！</span>
      </p>
      <div slot="btnGroup" class="btn-wrap">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
        <a class="btn btn--m" href="/#/cart">去结算</a>
      </div>
    </modal>

    <!-- 网页底部 -->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from "./../components/Navheader.vue";
import NavFooter from "./../components/NavFooter.vue";
import NavBread from "./../components/NavBread.vue";
import Modal from "./../components/Modal.vue";
import axios from "axios";
export default {
  data() {
    return {
      goodsList: [], // 商品列表
      priceChecked: "all", // 选择所有价格范围的商品
      priceLevel: "all", // 商品价格区间选择
      filterBy: false, // 价格筛选
      overLayFlag: false, // 窄宽价格筛选抽屉遮罩
      sortFlag: true, // 价格升降序排列
      page: 1, // 请求商品的页数
      pageSize: 8, // 每页请求商品的数量
      mdShowLogin: false, // 检测登录模态框
      mdShowCart: false, // 成功加入购物车模态框
      busy: true, // 显示正在加载商品列表标志
      loadMoreFlag: false, // 无限滚动标志
      priceFilter: [
        // 价格筛选区间
        {
          startPrice: 0,
          endPrice: 500
        },
        {
          startPrice: 500,
          endPrice: 1000
        },
        {
          startPrice: 1000,
          endPrice: 2000
        },
        {
          startPrice: 2000,
          endPrice: 5000
        }
      ]
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted() {
    this.init();
  },
  methods: {
    // 页面初始化
    init() {
      this.getGoodsList();
    },

    // 获取商品列表
    getGoodsList(flag) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceLevel
      };
      this.loadMoreFlag = true;
      axios.get("/goods/list", { params: param }).then(response => {
        let res = response.data;
        if ((res.status = "0")) {
          if (flag) {
            this.goodsList = this.goodsList.concat(res.result.list);
            if (res.result.count < 8) {
              this.busy = true;
              this.loadMoreFlag = false;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsList = res.result.list;
            this.busy = false;
          }
        } else {
          this.goodsList = [];
        }
      });
    },

    // 按价格排列商品
    sortGoodsList(flag) {
      this.sortFlag = flag;
      this.page = 1;
      this.getGoodsList();
    },

    // 显示筛选框（窄宽有效）
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },

    // 设置选中所有价格
    chooseAll() {
      this.priceChecked = "all";
      this.priceLevel = "all";
      this.closePop();
      this.page = 1;
      this.getGoodsList();
    },

    // 设置价格筛选
    setPriceFilter(index) {
      this.priceChecked = index;
      this.closePop();
      this.page = 1;
      this.priceLevel = index;
      this.getGoodsList();
    },

    // 关闭价格筛选框
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },

    // 加载更多商品
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },

    // 加入购物车
    addCart(productId) {
      axios
        .post("/goods/addCart", {
          productId: productId
        })
        .then(response => {
          let res = response.data;
          if (res.status == "0") {
            this.mdShowCart = true;
            this.$store.commit("updateCartCount",this.$store.state.cartCount + 1);
          } else {
            this.mdShowLogin = true;
          }
        });
    },

    // 关闭模态框
    closeModel() {
      this.mdShowLogin = false;
      this.mdShowCart = false;
    }
  }
};
</script>
