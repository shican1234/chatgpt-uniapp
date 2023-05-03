<template>
	<view>
		<view>
			<!-- <button @click="login()">点我进行授权登陆</button> -->
			<button
			   class="cu-btn author-btn"
			   open-type="getPhoneNumber"
			   @getphonenumber="phoneLogin">微信手机号一键登录</button>
		</view>
		<!-- 将我们的通过getUserProfile获取到的用户信息进行一个显示处理 -->
		<view>
			<img :src="userInfo.avatarUrl">
			<text>{{userInfo.nickName}}</text>
			
		</view>
		<view>
			<text>信息是：{{msg}}</text>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				userInfo:{
					avatarUrl:'',
					nickName:'',
					
				},
				msg:'',
			}
		},
		onLoad() {
			uni.login({
					provider: 'weixin',
					success(res2) {
						uni.setStorageSync('wxCode',res2.code);
						
					}
				})
		},
		methods: {
			phoneLogin(e) {
				let code = uni.getStorageSync('wxCode');
				console.log(code)
				// let _this=this;
				let pid = '';//这个要从缓存获取 是否带来了
				console.log(code)
				if (e.mp.detail.errMsg == 'getPhoneNumber:ok') {
					console.log(e.mp.detail)
					let encryptedData =e.mp.detail.encryptedData
					let iv =e.mp.detail.iv
					const user = {
							encryptedData: encryptedData,
							iv: iv,
							code: code//这个只是我们的临时code
						}
					uni.request({
						method:'POST',
						url:'https://dianying.momoyucm.top/api/oauth/miniAppLogin',
						data:user,
						success(res) {
							console.log(res.data);
							
							
						}
					})
					
				}else{
					
				}
				
				}
			
			}
		}
</script>

<style>
	
</style>

