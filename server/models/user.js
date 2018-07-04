let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema ({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": [
    {
      orderId: String,
      orderPrice: Number,
      addressInfo: Object,
      goodList: Object,
      orderStatus: Number,
      orderDate: String
    }
  ],
  "cartList": [
    {
      "productId": String,
      "productName": String,
      "salePrice": String,
      "productImage": String,
      "productNum": Number,
      "checked": Boolean
    }
  ],
  "addressList": [
    {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": String,
      "tel": String,
      "isDefault": Boolean
    }
  ]
});

module.exports = mongoose.model('User',userSchema);