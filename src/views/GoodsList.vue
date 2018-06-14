<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">排序：</span>
          <a @click="sortGoodsList(true)" href="javascript:void(0)" class="order-Rise" v-bind:class="{'cur':sortFlag==true}">升序</a>
          <a @click="sortGoodsList(false)" href="javascript:void(0)" class="order-decline" v-bind:class="{'cur':sortFlag==false}">降序 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">筛选</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>价格:</dt>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="chooseAll()">所有</a></dd>
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}}-{{price.endPrice}}</a>
              </dd>
            </dl>
          </div>
    
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-bind:src="`static/img/${item.productImage}`" v-bind:alt="`${item.productName}`"></a>
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
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <img src="static/loading-svg/loading-spinning-bubbles.svg" v-show="loadMoreFlag">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <nav-footer></nav-footer>
  </div>
</template>

<style>
.load-more {
  height: 100px;
  font-weight: 100px;
  text-align: center;
}
</style>

<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import './../assets/css/supply.css'
import NavHeader from './../components/Navheader.vue'
import NavFooter from './../components/NavFooter.vue'
import NavBread from './../components/NavBread.vue'
import axios from 'axios'
export default {
  data () {
    return {
      goodsList:[],
      priceChecked:'all',
      filterBy:false,
      overLayFlag:false,
      sortFlag:true,
      page:1,
      pageSize:8,
      busy:true,
      loadMoreFlag:false,
      priceLevel:'all',
      priceFilter: [
        {
          startPrice:0,
          endPrice:500
        },
        {
          startPrice:500,
          endPrice:1000
        },
        {
          startPrice:1000,
          endPrice:2000
        },
        {
          startPrice:2000,
          endPrice:5000
        }
      ]
    } ; 
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  mounted () {
    this.getGoodsList();
  },
  methods:{
    getGoodsList (flag) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceLevel
      }
      this.loadMoreFlag = true;
      axios.get('/goods',{params:param}).then((result)=>{
        let res = result.data;
        if (res.status = '0') {
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
        
      })
    },
    sortGoodsList (flag) {
      this.sortFlag = flag;
      this.page = 1;
      this.getGoodsList();
    },
    showFilterPop () {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    setPriceFilter (index) {
      this.priceChecked=index;
      this.closePop();
      this.page = 1;
      this.priceLevel = index;
      this.getGoodsList();
    },
    closePop () {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    loadMore () {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },
    chooseAll () {
      this.priceChecked='all';
      this.priceLevel='all';
      this.page=1;
      this.getGoodsList();
    },
    addCart (productId) {
      axios.post("/goods/addCart",{
        productId: productId
      }).then((res)=>{
        if (res.status = '0') {
          alert("加入成功");
          console.log(res);
        } else {
          alert("msg:"+res.data.msg);
        }
      })
    }
  }
}

</script>
