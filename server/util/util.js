/**
 * 日期格式化工具
 * @param {string} fmt 目标字符串格式,默认：yyyy-MM-dd HH:mm:ss
 * @returns {string} 返回格式化后的日期字符串
 * 
 * 支持参数
 * yyyy：年
 * q: 季度
 * MM：月
 * dd：日
 * hh: 时
 * mm：分
 * ss：秒
 * S：毫秒
 */

Date.prototype.Format = function (fmt) {
  var f = fmt || "yyyy-MM-dd hh:mm:ss";
  var o = {
    "q+": Math.floor((this.getMonth() + 3) / 3),    // 季度
    "M+": this.getMonth() + 1,    // 月份
    "d+": this.getDate(),   // 日
    "h+": this.getHours(),    // 时
    "m+": this.getMinutes(),    // 分
    "s+": this.getSeconds(),    // 秒
    "S": this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(f)) {
    f = f.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(f)) {
      f = f.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])   : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return f;
}

module.exports = {};
