let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods');
let User = require('../models/user');

// 连接mangoDB数据库
mongoose.connect('mongodb://localhost:27017/market');

mongoose.connection.on('connected',function () {
  console.log('mongodb connected success');
})

mongoose.connection.on('error',function () {
  console.log('mongodb connected fail');
})

mongoose.connection.on('disconnected',function () {
  console.log('mongodb connected disconnected');
})

router.get("/", function(req, res, next) {
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let sort = req.param('sort');
  let skip = (page - 1)*pageSize;
  let params = {};
  let priceLevel = req.param('priceLevel');
  if (priceLevel != 'all') {
    let priceGt = '';
    let priceLte = '';
    switch(priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 500;
        break;
      case '1':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '2':
        priceGt = 1000;
        priceLte = 2000;
        break;
      case '3':
        priceGt = 2000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status:"1",
        msg: err.message,
      });
    } else {
      res.json({
        status:"0",
        msg:"",
        result: {
          count: doc.length,
          list: doc,
        }
      })
    }
  })
});

router.post("/addCart",function (req, res, next) {
  let userId = '123456';
  let productId = req.body.productId;
  User.findOne({userId:userId},function (err,userDoc) {
    if (err) {
        res.json({
          status: "1",
          msg: err.message
        })
    } else {
        if (userDoc) {
          let userItem = "";
          userDoc.cartList.forEach(item => {
            if (item.productId == productId) {
              userItem = item;
              item.productNum ++;
            }
          })
          if (userItem) {
            userDoc.save(function (err2,doc2) {
              if (err2) {
                res.json ({
                  status: "1",
                  msg: err2.message
                })
              } else {
                res.json({
                  status: "0",
                  msg: "",
                  result: userItem,
                })
              }
            })
          } else {
            Goods.findOne({productId:productId},function (err, doc) {
              if (err) {
                res.json({
                  status:"1",
                  msg: err.message
                })
              } else {
                if (doc) {
                  var obj = doc.toObject();
                  obj.productNum = 1;
                  obj.checked = 1;
                  userDoc.cartList.push(obj);
                  userDoc.save(function (err2,doc2) {
                    if (err2) {
                      res.json ({
                        status: "1",
                        msg: err.message
                      })
                    } else {
                      res.json({
                        status: "0",
                        msg: "",
                        result: doc,
                      })
                    }
                  })
                }
              }
            });
          }
        }
    }
  });
})

module.exports = router;