/**
 * 将中国标准时间日期转为yyyy-MM-dd HH:mm:ss格式
 * @param {*} date 
 */
export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
/**
 * 将中国标准时间日期/xxxx-xx-xx 格式化成指定的格式
 * @param {*} dateStr  格式化的日期时间
 * @param {*} symbol 拼接的符号
 */
export function dateStrToFormat(dateStr, symbol = '-') {
  let dateTime = new Date(dateStr);
  let year = dateTime.getFullYear();
  let month = dateTime.getMonth() + 1 < 10 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1;
  let day = dateTime.getDate() < 10 ? `0${dateTime.getDate()}` : dateTime.getDate();
  return `${year}${symbol}${month}${symbol}${day}`
}
/**
 * 将中国标准时间日期转为yyyy-MM格式
 * @param {*} date 
 */
export function getYearMonth(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return year + "-" + month;
}
/**
 * 将时间戳转为yyyy-MM-dd格式
 * @param {*} dateVal 传入的时间戳
 */
export function parseDate(dateVal) {
  let date = new Date(dateVal);
  let y = 1900 + date.getYear();
  let m = "0" + (date.getMonth() + 1);
  let d = "0" + date.getDate();
  return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}
/**
 * 将yyyy-MM-dd HH:mm:ss格式转为时间戳
 * @param {*} date 日期
 */
export function formatDate(date) {
  return new Date(date).getTime();
}
/**
 * 判断开始日期是否大于结束日期，结束日期是否小于开始日期
 * @param {*} startTime 开始日期
 * @param {*} endTime 结束日期
 */
export function comparedate(startTime, endTime) {
  return this.formatDate(startTime) >= this.formatDate(endTime);
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 传入数字返回星期
 * @param {*} week 数字
 */
export function getWeek(week) {
  if (week == 0) {
    week = '星期日';
  } else if (week == 1) {
    week = '星期一';
  } else if (week == 2) {
    week = '星期二';
  } else if (week == 3) {
    week = '星期三';
  } else if (week == 4) {
    week = '星期四';
  } else if (week == 5) {
    week = '星期五';
  } else if (week == 6) {
    week = '星期六';
  }
  return week;
}