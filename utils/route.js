/**
 * 保留当前页面，跳转到应用内的某个页面
 * @param {*} routeName 路径
 * @param {*} params 参数
 */
export function navigate(routeName,params){
	if(params)routeName+="?"+joinParams(params);
	wx.navigateTo({url: routeName});
}
/**
 * 关闭当前页面，跳转到应用内的某个页面
 * @param {*} routeName 路径
 * @param {*} params 参数
 * @param {*} isTab 是否为tab页面
 */
export function redirectTo(routeName, params,isTab = false){
	if(isTab){
		wx.switchTab(routeName, params)
		return
	}
	if(params)routeName += '?' + joinParams(params)
	wx.redirectTo({url: routeName})
}
/**
 * 关闭当前页面，跳转到应用内的某个页面 并携带路径和参数
 * @param {*} routeName 路径
 */
export function reLaunchBack(routeName){
	let routes = getCurrentPages()
	let curRoute = '/' + routes[routes.length - 1].route
	let curParam = routes[routes.length - 1].options
	let optionss = { redirectUrl: curRoute, ...curParam }
	redirectTo(routeName, optionss)
}
/**
 * 页面返回
 * @param {*} num 
 */
export function back(num = 1){
	wx.navigateBack({delta: num})
}
// 将对象拆为用&和=连接的字符串
function joinParams(data) {
	let paramsArr = []
	for (let key in data) {paramsArr.push(key+ '=' + data[key])}
	return paramsArr.join('&')
}