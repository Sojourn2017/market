let express = require('express');
let router = express.Router();
let User = require("./../models/user");
let res_Interf =  require("./../util/resInterface");
require("./../util/util");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 用户登录
router.post('/login',function (req,res,next) {
  let params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(params,function (err, doc) {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      if (doc) {
        res.cookie('userId',doc.userId,{
          path:'/',
          maxAge:1000*60*30
        });
        res.cookie('userName',doc.userName,{
          path:'/',
          maxAge:1000*60*30
        });
        res_Interf.send(res,"0","",{
          userName: doc.userName
        });
      } else {
        res.json({
          status: "1001",
          msg: "用户名或密码错误"
        })
      }
    }
  })
});

// 注销用户登录
router.post('/logout',function (req,res,next) {
  res.cookie('userId','',{
    path: '/',
    maxAge: null
  });
  res.cookie('userName','',{
    path: '/',
    maxAge: null
  });

  res.json({
    status: "0",
    msg: "",
    result: ""
  })
});

// 检测用户是否登录
router.get('/checkLogin',function (req,res,next) {
  if (req.cookies.userId) {
    res_Interf.send(res,"0","",req.cookies.userName);
  } else {
    res_Interf.send(res,"1","请先登录");
  }
});

// 获取购物车列表
router.get("/cartList",function (req,res,next) {
  let userId = req.cookies.userId;
  User.findOne ({userId:userId},function (err,doc) {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      if (doc) {
        res.json ({
          status:"0",
          msg:"",
          result:doc.cartList
        })
      } else {
        res.json ({
          status:"1001",
          msg:"购物车没有商品",
          result:""
        })
      }
    }
  })
});

// 删除指定商品
router.post("/productDel",function (req,res,next) {
  let [userId, productDelId] = [req.cookies.userId, req.body.productId];
  console.log()
  User.update({
    "userId":userId
  },{
    $pull:{
      "cartList":{
        "productId":productDelId
      }
    }
  },function (err,doc) {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      res.json ({
        status:"0",
        msg:"delete success",
        result:""
      })
    }
  });
});

// 更改购物车指定商品数量和选中状态
router.post("/editCart",function (req, res, next) {
  let [userId, productId, productNum, checked] = 
      [req.cookies.userId, req.body.productId, req.body.productNum, req.body.checked];
  User.update({
    userId:userId,
    "cartList.productId": productId,
  },{
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked 
  },function (err, doc) {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      res.json ({
        status:"0",
        msg:"success",
        result:""
      })
    }
  });
});

// 购物车商品全选信号
router.post("/selectAll", function (req, res, next) {
  let [userId,selectAllFlag] = [req.cookies.userId,req.body.selectAllFlag];
  User.updateMany({
    "userId":userId
  },{
    $set:{
      "cartList.$[].checked": selectAllFlag 
    }
  },function(err,doc) {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      res.json ({
        status:"0",
        msg:"success",
        result:""
      })
    }
  })
});

// 查询购物车数量
router.get("/getCartCount",function (req, res, next) {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    User.findOne({userId:userId},function(err,doc) {
      if (err) {
        res_Interf.send(res,"1",err.message);
      } else {
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function (item) {
          cartCount += parseInt(item.productNum);
        });
        res_Interf.send(res,"0","",cartCount);
      }
    })
  }
})

// 获取收货地址
router.get("/addressList",function(req,res,next) {
  let userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,doc) {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      if (doc.addressList.length > 0) {
        res.json({
          status:"0",
          msg:"",
          result:doc.addressList
        })
      } else {
        res.json({
          status:"1001",
          msg:"no address",
          result:""
        })
      }
    }
  })
})

// 设置默认地址
router.post("/setDefault", function(req,res,next) {
  let [userId,addressId] = [req.cookies.userId,req.body.addressId];
  if (!addressId) {
    res.json({
      status:"1003",
      msg: "addressId is null",
      result: ""
    })
  } else {
    User.findOne({userId:userId},function (err,doc) {
      if (err) {
        res_Interf.send(res,"1",err.message);
      } else {
        let addressList = doc.addressList;
        addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        });
        doc.save(function(err,doc) {
          if (err) {
            res_Interf.send(res,"1",err.message);
          } else {
            res.json({
              status:"0",
              msg:"",
              result:""
            })
          }
        })
      }
    })
  }
})

// 删除指定地址
router.post("/addressDel",function (req,res,next) {
  let [userId, addressDelId] = [req.cookies.userId, req.body.addressId];
  User.update({
    userId:userId
  },{
    $pull:{
      addressList:{
        addressId:addressDelId
      }
    }
  },function (err,doc) {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      res.json ({
        status:"0",
        msg:"delete success",
        result:""
      })
    }
  });
});

// 获取订单列表
router.get("/orderList",function(req,res,next) {
  let userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,doc) {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      if (doc && doc.cartList.length) {
        let cartList = doc.cartList;
        let orderList = [];
        for (let item of cartList) {
          if (item.checked) {
            orderList.push(item);
          }
        } 
        res.json({
          status:"0",
          msg:"",
          result:orderList
        })
      } else {
        res.json({
          status:"1001",
          msg:"no cartList",
          result:"",
        });
      }
    }
  })
})

// 生成订单
router.post("/payMent",function(req,res,next) {
  let [userId,addressId,totalPay] = [req.cookies.userId,req.body.addressId,req.body.totalPay];
  User.findOne({userId:userId},function(err,doc) {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      if(doc) {
        let address = "";
        goodList = [];
        // 获取用户当前订单地址信息
        doc.addressList.forEach((item)=>{
          if (item.addressId == addressId) {
            address = item;
          }
        });

        // 地址检测
        if (!address) {
          res.json({
            status:"1001",
            msg:"地址错误",
            result:""
          })
          return;
        }

        // 获取用户当前订单商品信息
        doc.cartList.filter((item)=>{
          if (item.checked) {
            goodList.push(item);
          }
        })

        // 生成订单号
        let [platform,r1,r2,sysDate,orderDate] = [
          "626",
          Math.floor(Math.random()*10),
          Math.floor(Math.random()*10),
          new Date().Format("yyyyMMddhhmmss"),
          new Date().Format("yyyy-MM-dd hh:mm:ss"),
        ];
        let orderId = platform + r1 + sysDate + r2;

        // 创建订单
        let order = {
          orderId: orderId,
          orderPrice: totalPay,
          addressInfo: address,
          goodList: goodList,
          orderStatus: 1,
          orderDate:orderDate
        }

        // 保存订单
        doc.orderList.push(order);
        doc.save(function (err1,doc1) {
          if (err1) {
            res_Interf.send(res,"1",err.message);
          } else {
            res.json({
              status:"0",
              msg:"",
              result:{
                orderId:order.orderId,
                orderPrice:totalPay
              }
            })
          }
        })
      } else {
        res.json({
          status:"1001",
          msg:"no result",
          result:""
        })
      }
    }
  })
})

// 查询订单
router.get("/orderDetail",function(req,res,next) {
  let [userId,orderId] = [req.cookies.userId,req.query.orderId];
  User.findOne({
    userId:userId
  },function (err,userInfo) {
    if (err) {
      res_Interf.send(res,"1",err.message);
    } else {
      if (userInfo) {
        let orderList = userInfo.orderList;
        let order;
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            order = item;
          }
        });
        if (!order) {
          res.json({
            status:"1001",
            msg:"无此订单",
            result:""
          })
          return;
        }
        res.json({
            status:"0",
            msg:"",
            result:{
              orderId:order.orderId,
              orderPrice:order.orderPrice
            }
        })
      } else {
        res.json({
          status:"1001",
          msg:"找不到此用户",
          result:""
        })
      }
      
    }
  })
})
module.exports = router;
