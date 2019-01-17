
// 年月日
const getnyr = (date) => {
  if (!date) return '';

  // 字符串
  if(typeof date == "string"){
    return date.substring(0,10)
  }

  // 时间戳
  date = new Date(date);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  if (m < 10) m = '0' + m;
  if (d < 10) d = '0' + d;
  let result = y + '-' + m + '-' + d;
  return result;
}

/**
 * 时分秒
 * type = "HH-MM" || "HH-MM-SS"
 */
const getsfm = (date,type) => {
  if (!date) return '';

  // 字符串
  if (typeof date == "string") {
    return date.substring(11, 16)
  }

  // 时间戳
  date = new Date(date);
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  if (m < 10) m = '0' + m;
  if (s < 10) s = '0' + s;

  if(type == "HH-MM"){
    return h + ':' + m
  }else{
    return h + ':' + m + ':' + s
  }
}

// 时间差计算
const timeFn = function (d1) {
  //di作为一个变量传进来
  var dateBegin = new Date(d1);
  var dateEnd = new Date(); //获取当前时间
  var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
  var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)
  // console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
  // console.log(dateDiff + "时间差的毫秒数", dayDiff + "计算出相差天数", leave1 + "计算天数后剩余的毫秒数"
  //   , hours + "计算出小时数", minutes + "计算相差分钟数", seconds + "计算相差秒数");

  return dayDiff
  // return dayDiff + '天' + hours + '小时' + minutes + '分';
}

module.exports = {
  getnyr: getnyr,
  getsfm: getsfm,
  timeFn: timeFn,
}