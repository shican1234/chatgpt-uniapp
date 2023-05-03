<template>
	<view class="page">
		<view class="header-bg pt-36 text-center">
				
				<view class="">
					<image :src="user.avatar || avatarDeft" class="avatar-img" mode=""></image>
				</view>
				<view class="mt-20 flex-row flex-center c-f" @click="loginBtn" v-if="isLogin">
					{{user.nickName}} <image src="@/static/img/edit.png" class="icon-edit" mode=""></image>
				</view>
				<view class="mt-20 flex-row flex-center c-f" @click="loginBtn" v-else>
					请先登录
				</view>
		</view>
		<!-- 菜单列表 -->
		<view class="nav-container bg-white radius-12">
			<!-- #ifdef MP-WEIXIN -->
			<button class="navigator-box" open-type="contact" hover-class="none">
				<view class="flex-row flex-align font-30">
					<image src="@/static/img/kefu.png" class="icon-nav" alt=""></image>
					联系客服
				</view>
				<image src="@/static/img/right.png" class="icon-right" mode=""></image>
			</button>
			<!-- #endif -->
			
			<navigator class="navigator-box" url="/pages/user/issureList/issureList" hover-class="none">
				<view class="flex-row flex-align font-30">
					<image src="@/static/img/nav2.png" class="icon-nav" alt=""></image>
					问答记录
				</view>
				<image src="@/static/img/right.png" class="icon-right" mode=""></image>
			</navigator>
			<navigator class="navigator-box" url="/pages/user/editInfo/editInfo" hover-class="none">
				<view class="flex-row flex-align font-30">
					<image src="@/static/img/nav3.png" class="icon-nav" alt=""></image>
					修改资料
				</view>
				<image src="@/static/img/right.png" class="icon-right" mode=""></image>
			</navigator>
			<navigator class="navigator-box" hover-class="none" @click="loginOut()">
				<view class="flex-row flex-align font-30">
					<image src="@/static/img/logout.png" class="icon-nav" alt=""></image>
					退出登录
				</view>
				<image src="@/static/img/right.png" class="icon-right" mode=""></image>
			</navigator>
		</view>
	</view>
</template>

<script setup>
	import { onShow } from "@dcloudio/uni-app"
	import { userInfo } from '@/http/index.js'
	import { ref, reactive } from 'vue'
	import {toLogin, toast} from '@/utils/tools.js'
	import avatarDeft from '@/static/img/avatar_deft.png'
	const user = reactive({nickName: "",avatar:'',msgCount:0,vipDay:0});
	const isLogin = ref(true);
	onShow(()=>{
		let token = uni.getStorageSync('token');
		getUserInfo()
		
	})
		
		const that = this;
    //在H5页面 param.code 无法获取code值
		 // h5页面获取页面传参
		const functiongetQueryString = (name)=>{
				const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
				const url =  window.location.search.split('?')[1] || '';
				const r = url.match(reg) || [];
				return r[2];
		}
    // #ifdef H5
		
    const search =  window.location.search.split('?')[1] || '';
		console.log('search',search);
    
    // #endif
		const loginBtn  = ()=>{
			if(isLogin.value){
				uni.navigateTo({
					url:'/pages/user/editInfo/editInfo'
				})
			}else{
				toLogin()
			}
		}
	let cardPwd = ref(''),cardVisible= ref(false);
	function conponBtn(){
		cardPwd.value = '';
		cardVisible.value = true;
	}
	function getUserInfo(){
		userInfo().then(res=>{
			isLogin.value = true;
			let data = res.data;
			user.nickName = data.nickName;
			user.avatar = data.avatar;
			user.msgCount = data.msgCount;
		}).catch((error)=>{
			//这里不用判断 直接走接口 接口返回8000状态码 直接就是掉线了 对应取登录页面
			isLogin.value = false;
			console.log('user info',error)
		})
	}
	
	function loginOut(){
		// uni.setStorageSync('token',data.token);
		uni.removeStorage({
			key:'token',
			success: function (res) {
					uni.navigateTo({//退出后随便去一个要登录的页面 触发跳转登录页
						url:'/pages/user/editInfo/editInfo'
					})
				}
		})
	}
</script>

<style lang="scss" scoped>
.header-bg{
	height:320rpx;
	background: linear-gradient(135deg , #26CFA0, #26b3a0);
	.avatar-img{
		width:120rpx;
		height: 120rpx;
		border-radius: 50%;
		border:2px solid #FFFFFF;
	}
}
.icon-edit{
	width:40rpx;
	height:40rpx;
	margin-left:12rpx;
}
.recharge-box{
	background-color: rgba(0,0,0,.8);
	margin:24rpx 30rpx 0;
	.icon-vip{
		width:48rpx;
		height:48rpx;
		margin-right:12rpx;
	}
	.recharge-btn{
		background-color: $yellow;
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 25rpx;
		font-size: 26rpx;
	}
}

.nav-container{
	margin-top:120rpx;
	margin-left:30rpx;
	margin-right:30rpx;
	
	.navigator-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 90rpx;
		padding:0 12rpx;
		border-bottom:1px solid #E5E5E5;
	}
	.icon-nav{
		width:40rpx;
		height:40rpx;
		margin-right:12rpx;
	}
	.icon-right{
		width:40rpx;
		height:40rpx;
	}
}
	.mask-box{
		width:100vw;
		height:100vh;
		background-color: rgba(0,0,0,.2);
		position: fixed;
		top:0;
		right:0;
		.mask-content{
			width:560rpx;
			position: absolute;
			top:50%;
			left:50%;
			transform: translate(-50%,-50%);
			background-color: #FFF;
			border-radius: 20rpx;
		}
		.input-textarea{
			margin-top:20rpx;
			width:500rpx;
			height:350rpx;
			box-sizing: border-box;
			border:1rpx solid #EFEFEF;
			border-radius: 10rpx;
			padding:20rpx;
			line-height: 1,.25;
		}
		.mask-title{
			border-radius: 20rpx 20rpx 0 0;
			background-image: linear-gradient(90deg,#23dF99,#26b3a0);
			height:90rpx;
			color:#FFFFFF;
			position: relative;
			font-size: 30rpx;
			
			.icon-close{
				position: absolute;
				right:20rpx;
				top:50%;
				width:40rpx;
				height:40rpx;
				transform: translateY(-50%);
			}
		}
		.mask-footer{
			margin:40rpx 30rpx 30rpx;
			height:60rpx;
			line-height: 60rpx;
			border-radius: 12rpx;
		}
		.mask-input-box{
			margin-top:30rpx;
			
			.mask-input{
				margin:10rpx 0;
				padding:0 30rpx;
			}
		}
	}
</style>
