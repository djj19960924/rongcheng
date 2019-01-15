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

module.exports = {
  getnyr: getnyr, // 年月日
}