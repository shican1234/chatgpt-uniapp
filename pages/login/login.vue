<template>
	<view>
		<view class="header-box">
			<view class="text-center">
				<image src="@/static/img/aislogo.png" class="logo-img" mode=""></image>
			</view>
			<view class="logo-title font-30 c-3 mt-30 text-center">
				AI智能问答机器人
			</view>
			<view class="mt-60 font-24 c-6 text-center">
				<view class="">
					欢迎畅游AI智能问答机器人
				</view>
				<view class="mt-12">
					登录后，可获得问答权限及优惠券套餐等服务
				</view>
			</view>
			
			<!-- :disabled="userInfoDisabled" -->
	
			
			<!-- 小程序授权  -->
		<!-- 	<view class="mt-120 btn primary login-btn flex-row flex-center mt-120" @click="wxGetUserInfo">
				<image src="@/static/img/wechat.png" class="icon-wechat"></image>
				微信授权登录
			</view> -->
			<!--  #ifdef MP-WEIXIN -->
			<button class="btn primary login-btn mt-120" style="margin-top:15px;" open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber">手机号登录
			</button>
			<!-- #endif -->
			<!--  #ifdef H5 -->
			<!-- 微信公众号授权  -->
			<view class="mt-120 btn primary login-btn flex-row flex-center mt-120" @click="wxHtlLogin">
				<image src="@/static/img/wechat.png" class="icon-wechat"></image>
				微信授权登录
			</view>
			<!-- #endif -->
			<view class="mt-20 mt-100 agree-box">
				我已阅读并同意 <text class="agree-text">《隐私政策》</text> 和 <text class="agree-text">《使用协议》</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import env from '@/utils/env.js'
	import {miniAppLogin,wxUserInfo,getWxGZHAppid,mpWeChatLogin} from '@/http/index.js'
	const {
		proxy
	} = getCurrentInstance()
	const appid = "xxx"
	const secret = "xxx"
	const userInfoDisabled = ref(false)
	const userInfo = reactive({
		thirdAppType: 1,
		thirdUserId: "",
		nickName: '',
		wechatPicture: ''
	})
	const sessionKey = ref('') // session码
	const pageOption = ref()
	const overlayShow = ref(false)
	//参考文档
	// https://blog.csdn.net/heavenz19/article/details/125716798
	// 小程序授权
	const wxGetUserInfo = () => {
		
	}
 
	// 微信公众号登录
	const queryCode = ()=>{
		let href = window.location.href;
		let url = href.split('?')[1], obj = {};
		if(!url){
			return obj;
		}
		let searchArray = url.split('&');
		searchArray.map(item=>{
			let array = item.split('=');
			obj[array[0]] = array[1]
		})
		return obj;
	}
	const wxHtlLogin = ()=>{
		uni.showLoading({
			title: '登录中...'
		});
		let url = window.location.href;
		let redirect_uri=encodeURIComponent(url);
		getWxGZHAppid().then(res => {
			uni.hideLoading();
			let appId = res.data;
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+'&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'+'&t='+new Date().getTime();
		}).catch(e => {
			uni.hideLoading()
		})
	}


	/**
	 * 手机号授权
	 */
	const getPhoneNumber = (e) => {
	    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
	        console.log('用户拒绝提供手机号');
	    } else {
	        let {encryptedData,iv} = e.detail;
					console.log('code',e)
					overlayShow.value = false;
					let wxUserInfo = uni.getStorageSync('wxUserInfo');
					let code = uni.getStorageSync('wxCode');
					let param = {
						encryptedData,
						iv,
						code
					}
					
					if(wxUserInfo){
						param.nickName = wxUserInfo.nickName;
						param.avatar = wxUserInfo.avatarUrl;
					}
					
					bindTelApi(param)
					
	    }
	}

	const bindTelApi = (data) => {
		uni.showLoading({
			title: '登录中...'
		});
		miniAppLogin(data).then(res => {
			uni.hideLoading();
			let data = res.data;
			uni.setStorageSync('token', res.data.token);
			if(data.avatar){
				uni.switchTab({
					url: '/pages/index/index'
				})
			}else{
				uni.navigateTo({
					url: '/pages/user/editInfo/editInfo?type=login'
				})
			}
		}).catch(e => {
			uni.hideLoading()
		})
	}
	onLoad((options) => {
		pageOption.value = options
		// 微信小程序授权
		// #ifdef MP-WEIXIN
		uni.getProvider({
		  service: 'oauth',
		    success: function (res) {
		      if (~res.provider.indexOf('weixin')) {
		         uni.login({
		            provider: 'weixin',
		              success: (res) => {
										let code = res.code;
										uni.setStorageSync('wxCode',code);
									},
									fail: () => {
										uni.showToast({title:"微信登录授权失败",icon:"none"});
									}
								})
							}
						}
					});
		 //#endif
		 // #ifdef H5
		let querycode = queryCode();
		console.log(querycode)
		if(Object.keys(querycode).length != 0){
			// alert(querycode)
			uni.showLoading({
				title: '登录中...'
			});
			//说明code不为空  是回调回来的
			let code = querycode.code
			let param = {
				"code": code
			}
			mpWeChatLogin(param).then(res => {
				uni.hideLoading();
				let data = res.data;
				uni.setStorageSync('token', res.data.token);
				let protocol = window.location.protocol;
				let url = window.location.host;
				// let href = window.location.href;
				console.log(protocol)
				console.log(url)
				window.location.href=protocol+"//"+url;
				// uni.switchTab({
				// 	url: '/pages/index/index'
				// })
			}).catch(e => {
				uni.hideLoading()
			})
			
		}
		 //#endif
	})
	
</script>

<style lang="scss" scoped>
.header-box{
	padding-top:80rpx;
	
}
.logo-img{
	width:240rpx;
	height:240rpx;
}
.login-btn{
	margin-top:120rpx;
	margin-left:100rpx;
	margin-right:100rpx;
	height:80rpx;
	border-radius: 40rpx;
	.icon-wechat{
		width:40rpx;
		height:40rpx;
		margin-right: 12rpx;
	}
}
.agree-box{
	margin-left:100rpx;
}
.agree-text{
	color:$theme-color;
}
</style>
