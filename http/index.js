import request from '@/utils/request.js';

//验证码登录
export function smsLogin(data){
	return request({
			url: '/api/oauth/smsLogin',
			method: 'post',
			data
	})
}

//发送验证码
export function sendSms(data){
	return request({
			url: '/api/other/sendSms',
			method: 'get',
			data
	})
}

//查询热门问题
export function queryHotQs(data){
	return request({
			url: '/api/other/queryHotQs',
			method: 'get',
			data
	})
}


//用户信息
export function userInfo(data){
	return request({
			url: '/api/user/userInfo',
			method: 'get',
			data
	})
}
//上传图片
export function merChantupload(data){
	return request({
			url: '/api/upload/merChantupload',
			method: 'post',
			data,
			header:{
				ContentType:'multipart/form-data'
			}
	})
}
//更新用户信息
export function userUpdate(data){
	return request({
			url: '/api/user/update',
			method: 'post',
			data,
	})
}


//微信公众号登录
export function appWeChatLogin(data){
	return request({
			url: '/api/oauth/appWeChatLogin',
			method: 'post',
			data
	})
} 
//APP微信授权登录
export function mpWeChatLogin(data){
	return request({
			url: '/api/oauth/mpWeChatLogin',
			method: 'post',
			data
	})
} 
// 微信小程序登录
export function miniAppLogin(data){
	return request({
			url: '/api/oauth/miniAppLogin',
			method: 'post',
			data
	})
} 
//微信更新用户头像
export function wxUserInfo(data){
	return request({
			url: '/api/oauth/wxUserInfo',
			method: 'post',
			data
	})
}

//问答记录
export function queryQuestionAnswerList(data){
	return request({
			url: '/api/user/queryQuestionAnswerList',
			method: 'get',
			data
	})
}

// 微信公众号登录获取公众号appid
export function getWxGZHAppid(data){
	return request({
			url: '/api/oauth/getWxGZHAppid',
			method: 'get',
			data
	})
} 

