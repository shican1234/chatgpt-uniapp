<template>
	<view>
		<view class="header-box">
			<view class="text-center">
				<image src="@/static/img/aislogo.png" class="logo-img" mode=""></image>
			</view>
			<view class="logo-title font-30 c-3 mt-30 text-center">
				欢迎回来
			</view>
			<view class="mt-60 font-24 c-6 form-box">
				<view class="flex-row input-item flex-align">
					<image src="@/static/img/mobile.png" class="icon-mobile" alt=""></image>
					<input type="text" v-model="mobile" placeholder="请输入注册手机号码"  placeholder-class="input-placeholder" >
				</view>
				<view class="mt-40 flex-row input-item flex-align">
					<image src="@/static/img/validCode.png" class="icon-mobile" alt=""></image>
					<input type="text" class="flex-1" v-model="smsCode" placeholder-class="input-placeholder" placeholder="请输入验证码">
					<view class="" @click="getCodeBtn">
						{{codeStr}}
					</view>
				</view>
			</view>
			
			<view class="mt-120 btn primary login-btn flex-row flex-center" @click="submitBtn">
				登录
			</view>
			<view class="mt-20 mt-100 agree-box">
				我已阅读并同意 <text class="agree-text">《隐私政策》</text> 和 <text class="agree-text">《使用协议》</text>
			</view>
			<!-- 公众号授权 -->
			<!-- <view class="mt-40 flex-row flex-center" @click="wxHtlLogin">
				<image src="@/static/img/wechat.png" class="icon-wechat"  mode=""></image>
				微信授权
			</view> -->
			<!-- H5授权 -->
			<!-- #ifdef APP-PLUS -->
			<view class="mt-40 flex-row flex-center">
				<image src="@/static/img/wechat.png" class="icon-wechat"  mode="" @click="wxAppLogin()"></image>
				微信授权
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script setup >
	import env from '@/utils/env.js'
	import {
		ref,
		reactive,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import { toast } from '@/utils/tools.js'
	import {sendSms,smsLogin,appWeChatLogin} from '@/http/index.js'
	const mobile = ref('');
	const submitBtn = async ()=>{
		if(!mobile.value){
			return toast('请输入手机号')
		}else if(!/^1[0-9]{10}$/.test(mobile.value)){
			return toast("请输入正确的手机号码")
		}else if(!smsCode.value){
			return toast("请输入验证码")
		}
		let data = {
			mobile:mobile.value,
			code:smsCode.value
		}
		smsLogin(data).then(res=>{
			let data = res.data;
			if(data.id){
				uni.setStorageSync('token',data.token);
				toast('登录成功');
				// setTimeout(()=>{
				// 	uni.switchTab({
				// 		url:'/pages/index/index'
				// 	})
				// },500)
				if(data.avatar){
					uni.switchTab({
						url: '/pages/index/index'
					})
				}else{
					uni.navigateTo({
						url: '/pages/user/editInfo/editInfo?type=login'
					})
				}
			}
		}).catch(err=>{
			console.log('login err',err)
		})
	}
	const codeStr = ref('获取验证码');
	const isCode = ref(true);
	let codeTime = 60, codeTimer = null;
	//获取验证码
	const getCodeBtn = ()=>{
		if(!mobile.value) return toast("请输入手机号")
		if(!/^1[3-9][0-9]{9}$/.test(mobile.value)) return toast("请输入正确的手机号")
		if(!isCode.value) return;
		isCode.value = false;
		sendSms({mobile:mobile.value}).then(res=>{
			toast('发送成功')
			codeTimer = setInterval(()=>{
				codeTime -= 1;
				codeStr.value = `${codeTime}s重新获取`;
				if(codeTime <= 0){
					clearInterval(codeTimer)
					codeStr.value = '重新获取';
					isCode.value = true;
					codeTime = 10;
				}
			},1000)
			
		}).catch((err)=>{
			isCode.value = true;
		})
	}
	const smsCode = ref('');
	//微信公众号登录
	const queryCode = ()=>{
		let search = location.search, obj = {};
		let searchArray = search.split('&');
		searchArray.map(item=>{
			let array = item.split('=');
			obj[array[0]] = array[1]
		})
		return obj;
	}
	const wxHtlLogin = ()=>{
		
	}
	//微信App授权
	const wxAppLogin = ()=>{
		uni.login({ 
			"provider": "weixin",
			"onlyAuthorize": true, // 微信登录仅请求授权认证
			success: function(event){
				let code = event.code
				let param = {
					"code": code
				}
				appWeChatLogin(param).then(res => {
					console.log(res)
					uni.hideLoading();
					let data = res.data;
					uni.setStorageSync('token', res.data.token);
					uni.switchTab({
						url: '/pages/index/index'
					})
				}).catch(e => {
					uni.hideLoading()
				})
			},
			fail: function (err) {
				  // 登录授权失败  
				  // err.code是错误码
			  }
		  })

	}
</script>

<style lang="scss" scoped>
.header-box{
	padding-top:80rpx;
}
.logo-img{
	width:240rpx;
	height:240rpx;
}
.input-placeholder{
	font-size: 26rpx;
	color:#999999;
}
.mt-120{
	margin-top:120rpx;
}
.login-btn{
	margin-left:100rpx;
	margin-right:100rpx;
	height:80rpx;
	border-radius: 40rpx;
}
.icon-wechat{
		width:40rpx;
		height:40rpx;
		margin-right: 12rpx;
		background-color: $theme-color;
		border-radius:50%;
		padding:8rpx;
	}
.form-box{
	margin-left:80rpx;
	margin-right:80rpx;
	.input-item{
		border:1px solid #EFEFEF;
		padding:12rpx 20rpx;
		border-radius: 12rpx;
	}
}
.icon-mobile{
	width:40rpx;
	height:40rpx;
	margin-right:20rpx;
}
.agree-box{
	margin-left:100rpx;
}
.agree-text{
	color:$theme-color;
}
.flex-1{
	flex:1;
}
	
</style>