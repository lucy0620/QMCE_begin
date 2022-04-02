import request from "./request.js";

/**
 * 模板消息 Api 接口
 */
const templateApi = {

  /**
   * 根据标识类型获取模板id
   */
  getTemplateIdByType(params) {
    return request.requestApi('get', `wechat/${params.appId}/thirdparty/template/template/subscription/list?subscribeType=${params.subscribeType}`);
  },

  /**
   * 订阅管理页面-获取订阅信息列表
   */
  gettemplateRecordSubscribeList(params) {
    return request.requestApi('get','/wechat/templateRecordSubscribe/list', params);
  },

  /**
   * 订阅管理页面-获取订阅信息开关
   */
  gettemplateRecordSubscribeConfig() {
    return request.requestApi('get','/wechat/templateRecordSubscribe/config');
  },

  /**
   * 订阅管理页面-修改订阅信息开关
   */
  gettemplateRecordSubscribeConfigSave(params) {
    return request.requestApi('post','/wechat/templateRecordSubscribe/config/save',params)
  },

  /**
   * 保存订阅记录
   */
  gettemplateRecordSubscribeSave(params) {
    return request.requestApi('post','/wechat/templateRecordSubscribe/save',params)
  },

}

export default templateApi