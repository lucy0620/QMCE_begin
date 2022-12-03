// 正则匹配
let Pattern = {
  isEmpty: /(^\s*)|(\s*$)/g,
  isNumber: /^(\d+)?(?:\.\d{1,4})?$/,
  isMobile: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
  isCnAndEn: /^[\u4E00-\u9FA5]+$/,
  isCnAndEnAndNum: /^[\u4e00-\u9fa5-a-zA-Z0-9]+$/,
  isUserName: /^[(\u4e00-\u9fa5)a-zA-Z]+$/,
  // isPassword: /^(?:\d+|[a-zA-Z]+|[!@#~$%^_&*]+){8,}$/,
  // isPassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/,
  isPassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\W]{8,}$/,
  isAuthCode: /^[0-9]{4}$/,
  isEmail: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  isTelAndMobile: /^(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})$/,
  isIdCard: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
}

const validator = {
  /**
   * 执行正则表达式
   * @param pattern 校验的正则表达式
   * @param strValue 校验的值
   * @returns {boolean}
   */
  executeExp: function (pattern, strValue) {
    return pattern.test(strValue)
  },
  /**
   * 判断字符串是否为空
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isEmpty: function (strValue) {
    strValue = strValue.replace(Pattern.isEmpty, '')
    return strValue.length === 0
  },
  /**
   * 判断字符串是否非空
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isNotEmpty: function (strValue) {
    return !validator.isEmpty(strValue)
  },
  /**
   * 判断是否为中文
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isCnAndEn: function (strValue) {
    if (validator.isEmpty(strValue)) {
      return false
    }

    return validator.executeExp(Pattern.isCnAndEn, strValue)
  },
  /**
   * 判断是否为中英文、数字及'-'
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isCnAndEnAndNum: function (strValue) {
    if (validator.isEmpty(strValue)) {
      return false
    }

    return validator.executeExp(Pattern.isCnAndEnAndNum, strValue)
  },
  /**
   * 判断是否为用户名
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isUserName: function (strValue) {
    if (validator.isEmpty(strValue)) {
      return false
    }

    return validator.executeExp(Pattern.isUserName, strValue)
  },
  /**
   * 判断验证码格式
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isAuthCode: function (strValue) {
    if (validator.isEmpty(strValue)) {
      return false
    }
    return validator.executeExp(Pattern.isAuthCode, strValue)
  },
  /**
   * 判断邮箱格式
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isEmail: function (strValue) {
    if (validator.isEmpty(strValue)) {
      return false
    }
    return validator.executeExp(Pattern.isEmail, strValue)
  },
  /**
   * 判断是否为手机号码
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isMobile: (strValue) => {
    if (validator.isEmpty(strValue)) {
      return false
    }
    return validator.executeExp(Pattern.isMobile, strValue)
  },
  /**
   * 判断是否为数字
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isNumber: (strValue) => {
    if (validator.isEmpty(strValue)) {
      return false
    }
    return validator.executeExp(Pattern.isNumber, strValue)
  },
  /**
   * 判断是否为手机或电话号码
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isTelAndMobile: function (strValue) {
    if (validator.isEmpty(strValue)) {
      return false
    }
    return validator.executeExp(Pattern.isTelAndMobile, strValue)
  },
  /**
   * 判断是否为身份证
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isIdCard: function (strValue) {
    if (validator.isEmpty(strValue)) {
      return false
    }
    return validator.executeExp(Pattern.isIdCard, strValue)
  },
  /**
   * 判断是否符合密码规则
   * @param strValue 校验的值
   * @returns {boolean}
   */
  isPassword: function (strValue) {
    if (validator.isEmpty(strValue)) {
      return false
    }
    return validator.executeExp(Pattern.isPassword, strValue)
  },
  /**
   * 对象是否为空
   * @param obj 检验对象
   * @returns {boolean}
   */
  isEmptyObj: (obj) => {
    return Object.keys(obj).length === 0
  },
  /**
   * 是否在范围长度内
   * @param 范围数组 [1, 10] 长度在1-10内
   * @returns {boolean}
   */
  isLenRange: (strValue, lenArr) => {
    return strValue.length >= lenArr[0] && strValue.length <= lenArr[1]
  },
  /**
   * 最小长度
   * @param 范围数组 [1, 10] 长度在1-10内
   * @returns {boolean}
   */
  minLength: function (value, param) {
    return value.length >= param
  },
  /**
   * 最大长度
   * @param 范围数组 [1, 10] 长度在1-10内
   * @returns {boolean}
   */
  maxLength: function (value, param) {
    return value.length <= param
  },
  /**
   * 是否在数值范围内
   * @param 范围数组 [1, 10] 数值在1-10内
   * @returns {boolean}
   */
  isNumRange: (numValue, numArr) => {
    return numValue >= numArr[0] && numValue <= numArr[1]
  }

}

export default validator