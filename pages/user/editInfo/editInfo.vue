<template>
	<view class="page pad page-top">
		<view class="bg-white radius-10 list-box ">
			<view class="item px-20 py-30 flex space-between">
				<view class="c-3">
					头像
				</view>
				<image @click="changeAvatar" :src="user.avatar||avatarDeft" class="avatar-img" mode=""></image>
			</view>
			<view class="item px-20 py-30 flex space-between">
				<view class="c-3">
					昵称
				</view>
				<input placeholder="请输入昵称" v-model="user.nickName" placeholder-class="c-9 font-24" class="form-input c-6 font-28"/>
			</view>
			<view class="item px-20 py-30 flex space-between">
				<view class="c-3">
					ID号
				</view>
				<view class="c-6 font-28 flex-row flex-align">
					{{user.id}} <image src="@/static/img/pwd.png" class="icon-pwd" mode=""></image>
				</view>
			</view>
		</view>
		<view class="mt-40 save-btn btn primary flex flex-center radius-12" @click="submitBtn">
			保存资料
		</view>
	</view>
</template>

<script setup>
	import {ref, reactive} from 'vue';
	import { onShow ,onLoad} from "@dcloudio/uni-app"
	import { userInfo, userUpdate} from '@/http/index.js'
	import { toast,setNavigation } from '@/utils/tools.js'
	import avatarDeft from '@/static/img/avatar_deft.png'
	import env from '@/utils/env.js'
	const user = reactive({
		avatar:'',
		nickName:'',
		id:''
	})
	let type = ''
	onLoad((opts)=>{
		setNavigation()
		type = opts.type;
		if(type == 'login'){
			uni.setNavigationBarTitle({
				title:'完善资料'
			})
		}
	})
	onShow(()=>{
		userInfo().then(res=>{
			let data = res.data
			user.avatar = data.avatar;
			user.nickName = data.nickName;
			user.id = data.id;
		})
	})
	
	const changeAvatar = ()=>{
		uni.chooseImage({
			count:1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success:(res)=>{
				uni.showLoading({
					title:'上传中...'
				})
				uploadImage(res.tempFilePaths)
			}
		})
	}
	function uploadImage(tempFilePaths) {
			uni.uploadFile({
				url: env.BASE_URL + '/api/upload/merChantupload', //接口地址
				header: {
					"token": uni.getStorageSync('token'),
				},
				filePath: tempFilePaths[0],
				name: 'file',
				success: (resp) => {
					let res = JSON.parse(resp.data);
					if(res.msg === 'success'){
						user.avatar = res.data.src
					}
					uni.hideLoading();
					
				}
			})
		}
		
		function submitBtn(){
			if(!user.avatar){
				return toast("请上传头像")
			}
			if(!user.nickName){
				return toast("昵称不能为空")
			}
			userUpdate(user).then(res=>{
				toast(type==='login'?'编辑成功':'修改成功');
				setTimeout(()=>{
					uni.switchTab({
						url:type==='login'?'/pages/index/index':'/pages/user/user'
					})
				},1200)
			})
		}
		
</script>

<style lang="scss" scoped>
.avatar-img{
	width:80rpx;
	height: 80rpx;
	border-radius: 50%;
}
.icon-pwd{
	width:36rpx;
	height: 36rpx;
	margin-left:8rpx;
}
.form-input{
	text-align: right;
	width:240rpx;
}
.list-box{
	.item{
		border-bottom:1px solid #EFEFEF;
		&:last-child{
			border-bottom: none;
		}
	}
}
.save-btn{
	height: 88rpx;
}
</style>
