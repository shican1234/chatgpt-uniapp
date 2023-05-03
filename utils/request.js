
const BASE_URL = 'http://175.178.233.9:9569'
const request = ({
	url,
	data = {},
	method = 'get',
	header = {
		ContentType:'application/json' 
	},
}) => {
	let token = uni.getStorageSync('token') || '';
	if (!url) return;
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			method,
			data,
			header: {
				token,
				...header
			},
			success: (res) => {
				if(res.statusCode === 200 &&res.data.msg==='success'){
					resolve(res.data)
				}else if(res.statusCode === 403){
					uni.showToast({
						title:res.data,
						icon:'none'
					})
				}else if(res.data.code === 8000){
					// #ifdef APP-PLUS
						uni.redirectTo({
							//关闭当前页面，跳转到应用内的某个页面。
							url:'/pages/login/appLogin'
						});
					// #endif
					// #ifdef H5
						let ua = navigator.userAgent.toLowerCase();
						if (ua.match(/MicroMessenger/i) == "micromessenger"){
							//是
							uni.redirectTo({
								//关闭当前页面，跳转到应用内的某个页面。
								url:'/pages/login/login'
							});
						}else{
							//不是
							uni.redirectTo({
								//关闭当前页面，跳转到应用内的某个页面。
								url:'/pages/login/appLogin'
							});
						}
					// #endif
					// #ifdef MP-WEIXIN
						uni.redirectTo({
							//关闭当前页面，跳转到应用内的某个页面。
							url:'/pages/login/login'
						});
					// #endif
				
				
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:'none'
					})
				}
			},
			fail: (err) => {
				reject(err);
			}
		});
	})
}
export default request;

