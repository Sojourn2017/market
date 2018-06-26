<template>
  <header class="header">
        <div class="navbar">
          <symbol id="icon-status-ok" viewBox="0 0 32 32">
            <title>status-ok</title>
            <path class="path1" d="M22.361 10.903l-9.71 9.063-2.998-2.998c-0.208-0.209-0.546-0.209-0.754 0s-0.208 0.546 0 0.754l3.363 3.363c0.104 0.104 0.241 0.156 0.377 0.156 0.131 0 0.261-0.048 0.364-0.143l10.087-9.414c0.215-0.201 0.227-0.539 0.026-0.754s-0.539-0.226-0.754-0.026z"></path>
            <path class="path2" d="M16 30.933c-8.234 0-14.933-6.699-14.933-14.933s6.699-14.933 14.933-14.933c8.234 0 14.933 6.699 14.933 14.933s-6.699 14.933-14.933 14.933zM16 0c-8.822 0-16 7.178-16 16 0 8.823 7.178 16 16 16s16-7.177 16-16c0-8.822-7.178-16-16-16z"></path>
          </symbol>
          <div class="navbar-left-container">
            <a href="/">
              <img class="navbar-brand-logo" src="static/img/logo.png">
              <span class="navbar-brand-title">购物商城</span>
            </a>
          </div>
          <div class="navbar-right-container">
            <div class="navbar-menu-container">
              <!-- <a href="/" class="navbar-link">我的账户</a> -->
              <span class="navbar-link font-red" v-if="nickName" v-text="nickName"></span>
              <a href="javascript:void(0)" class="navbar-link" @click="loginModalFlag=true" v-if="!nickName">登录</a>
              <a href="javascript:void(0)" class="navbar-link" v-if="nickName" v-on:click="logOut">注销</a>
              <div class="navbar-cart-container ">
                <span class="navbar-cart-count"></span>
                <a class="navbar-link navbar-cart-link" href="/#/cart">
                  <svg baseProfile="tiny" height="20px" version="1.2" viewBox="0 0 19 19" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Layer_1"><g><path d="M20.756,5.345C20.565,5.126,20.29,5,20,5H6.181L5.986,3.836C5.906,3.354,5.489,3,5,3H2.75c-0.553,0-1,0.447-1,1    s0.447,1,1,1h1.403l1.86,11.164c0.008,0.045,0.031,0.082,0.045,0.124c0.016,0.053,0.029,0.103,0.054,0.151    c0.032,0.066,0.075,0.122,0.12,0.179c0.031,0.039,0.059,0.078,0.095,0.112c0.058,0.054,0.125,0.092,0.193,0.13    c0.038,0.021,0.071,0.049,0.112,0.065C6.748,16.972,6.87,17,6.999,17C7,17,18,17,18,17c0.553,0,1-0.447,1-1s-0.447-1-1-1H7.847    l-0.166-1H19c0.498,0,0.92-0.366,0.99-0.858l1-7C21.031,5.854,20.945,5.563,20.756,5.345z M18.847,7l-0.285,2H15V7H18.847z M14,7    v2h-3V7H14z M14,10v2h-3v-2H14z M10,7v2H7C6.947,9,6.899,9.015,6.852,9.03L6.514,7H10z M7.014,10H10v2H7.347L7.014,10z M15,12v-2    h3.418l-0.285,2H15z"/><circle cx="8.5" cy="19.5" r="1.5"/><circle cx="17.5" cy="19.5" r="1.5"/></g></g></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':loginModalFlag}">
          <div class="md-modal-inner">
            <div class="md-top">
              <div class="md-title">登录</div>
              <button class="md-close" @click="loginModalFlag=false">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <div class="error-wrap">
                  <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
                </div>
                <ul>
                  <li class="regi_form_input">
                    <i class="icon IconPeople"></i>
                    <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="测试用户名：test" data-type="loginname" value="test">
                  </li>
                  <li class="regi_form_input noMargin">
                    <i class="icon IconPwd"></i>
                    <input type="password" tabindex="2"  name="password" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="测试密码：123456" @keyup.enter="login" value="123456">
                  </li>
                </ul>
              </div>
              <div class="login-wrap">
                <a href="javascript:;" class="btn-login" @click="login">登  录</a>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-if="loginModalFlag" @click="loginModalFlag=false"></div>
      </header>
</template>

<script>
  import './../assets/css/login.css';
  import axios from 'axios'
  import { mapState } from 'vuex'
  export default{
      data(){
          return{
            userName:'',
            userPwd:'',
            errorTip:false,
            loginModalFlag:false,
            nickName:'',
          }
      },
      computed:{
        // ...mapState(['nickName','cartCount'])
      },
      /*nickName(){
        return this.$store.state.nickName;
      },
      cartCount(){
        return this.$store.state.cartCount;
      }*/
      mounted(){
          this.checkLogin();
      },
      methods:{
          checkLogin(){
              axios.get("/users/checkLogin").then((response)=>{
                  var res = response.data;
                  // var path = this.$route.pathname;
                  if(res.status=="0"){
                    this.nickName = res.result;
                    // this.$store.commit("updateUserInfo",res.result);
                    this.loginModalFlag = false;
                  }else{
                    // if(this.$route.path!="/goods"){
                    //   this.$router.push("/goods");
                    // }
                  }
              });
          },
          login(){
              if(!this.userName || !this.userPwd){
                this.errorTip = true;
                return;
              }
              axios.post("/users/login",{
                userName:this.userName,
                userPwd:this.userPwd
              }).then((response)=>{
                  let res = response.data;
                  if(res.status=="0"){
                    this.errorTip = false;
                    this.loginModalFlag = false;
                    this.nickName = res.result.userName;
                    // this.$store.commit("updateUserInfo",res.result.userName);
                    // this.getCartCount();
                  }else{
                    this.errorTip = true;
                  }
              });
          },
          logOut(){
              axios.post("/users/logout").then((response)=>{
                  let res = response.data;
                  if (res.status=="0") {
                      this.nickName = '';
                      // this.$store.commit("updateUserInfo",res.result.userName);
                  }
              })
          },
          getCartCount(){
            axios.get("users/getCartCount").then((response) => {
              var res = res.data;
              // this.$store.commit("updateCartCount",res.result);
            });
          }
      }
  }
</script>

