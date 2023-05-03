<template>
	<view class="pad page page-top">
		<!-- <scroll-view scroll-y="true" :scroll-top="scrollTop" class="scroll-view" id="scrollView"> -->
		<view class="chat-box ">
			<image src="@/static/img/aislogo.png" class="avatar-img" mode=""></image>
			<view class="content-info">
				<view class="title font-24 c-6">
					小助手
				</view>
				<view class="say-content temp-content" style="padding-bottom:20rpx;">
					<view class="">
						您可以点击下方案例直接提问...
					</view>
					<template v-if="hotArray.length">
						<view class="ques-tips" @click="tempBtn(item.hotQs)" v-for="item in hotArray" :key="item.id">
							{{item.hotQs}}
						</view>
					</template>
					<template v-else>
						<view class="loading-box">
							<image src="@/static/img/loading.png" class="loading-img" mode=""></image>
						</view>
					</template>
					
					<view class="rechange-box flex-row flex-end flex-align" @click="getHotQS">
						换一换 <image src="@/static/img/refresh.png" class="icon-refresh" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view class="chat-box" :class="{'flex-end':item.self=== 1}" v-for="(item,index) in chatList" :key="item.id">
			<image :src="item.avatarImg" class="avatar-img" mode=""></image>
			<view class="content-info">
				<view class="title font-24 c-6">
					{{item.modelRole}}
				</view>
				<view class="say-content-box">
					<view class="say-content" :class="{'item-content':item.self === 0}"  style="background-color: #FFF;padding:20rpx;border-radius: 10rpx;">
						<template v-if="item.isList">
							<view v-for="(its,index) in item.contentList" :class="{'markdown-box':its.isCode}" :key="index">
								<mp-html v-if="its.isCode" :content="its.content"></mp-html>
								<text v-else>{{its.content}}</text>
							</view>
						</template>
						
						<text v-else 
							:class="{'move-cursor':isConnect&& item.self === 0 && (index+1==chatList.length)}"
							>{{item.content}}
						</text>
					
					</view>
				</view>
				<view class="mt-8 c-6 font-24" v-if="item.isEnd && !item.self " @click="copyContentBtn(item.content)">
					复制内容
				</view>
			</view>
		</view>

		<view class="footer-margin"></view>
		<!-- </scroll-view> -->
		
		<view class="footer-input-box flex-row pad-30 flex-align" >
			<input type="text" v-model="content" class="form-input"  placeholder="请输入您的问题" placeholder-class="input-placeholder"/>
			<view class="send-btn btn primary flex-center" :class="{disabled:isConnect}" @click="sendBtn">
				发送
			</view>
		</view>
		
	</view>
</template>

<script setup>
	import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html";
	import { marked } from "marked";
	import hljs from "highlight.js";
	import "highlight.js/scss/atom-one-dark.scss";
	
	import {ref, reactive,nextTick  } from 'vue'
	import {	onLoad, onShow, onUnload,onHide } from '@dcloudio/uni-app'
	import {userInfo, queryHotQs } from '@/http/index.js'
	import { toast, copyContent } from '@/utils/tools.js'
	
	import env from '@/utils/env.js'
	import avatarDef from '@/static/img/avatar_deft.png'
	import aislogo from '@/static/img/aislogo.png'
	const hotArray = reactive([]);
	let socketTask = null,isConnect = ref(false),scrollTop=ref(0),
		qsTimer = new Date().getTime(), wssIsConnect = true;
	function initHighLight() {
			hljs.configure({
				useBR: true,
				tabReplace: " ",
			});
			marked.setOptions({
				renderer: new marked.Renderer(),
				gfm: true,
				tables: true,
				breaks: false,
				pedantic: false,
				highlight: function (code, lang) {
					if (lang && hljs.getLanguage(lang)) {
						return hljs.highlight(lang, code, true).value;
					} else {
						return hljs.highlightAuto(code).value;
					}
				},
			});
		}
	onLoad(()=>{
		let token = uni.getStorageSync('token');
		if(!token){
			// return uni.navigateTo({
			// 	url:'/pages/login/appLogin'
			// })
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
			
		}
		userInfo().then(res=>{
			let data = res.data;
			user.avatar = data.avatar||avatarDef;
			user.nickName = data.nickName;	
		})
		
		getHotQS()
		
		//创建链接
		socketTask = uni.connectSocket({
			url: env.BASE_WS+'/api/websocket/'+token, //仅为示例，并非真实接口地址。
			success: (res)=> {
				console.log('ws succ',res);
			},
			complete(res) {
				console.log('ws complete',res);
			}
		});
		socketTask.onOpen(function(res) {
			console.log('WebSocket连接已打开！');
			let tmpContent = uni.getStorageSync('tmpContent');
			if(tmpContent){
				content.value = tmpContent;
				sendBtn()
				uni.setStorageSync('tmpContent','');
			}
		})
		
		socketTask.onMessage((res) => {
			let lastItem = chatList[chatList.length-1];
			let data = res.data;
			wssIsConnect = true;
			// if(/提问次数已用完/.test(data)){
			// 	return toast("聊天次数已经用完")
			// }
			if(new Date().getTime() - qsTimer>1.5e3){
				scrollBottom();
				qsTimer = new Date().getTime();
			}
			if(data != '[DONE]'){
				isConnect.value = true;
				if(lastItem.content == '正在思考中...'){
					lastItem.content = data
				}else{
					lastItem.content += data
				}
			}else{
				let content = lastItem.content, contentArr = content.split('```');
				if(contentArr.length>2){
					lastItem.isList = true;
					let contentList = [];
					contentArr.map(it=>{
						let obj = {};
						obj.isCode = /^(javascript|java|go|python|php|c|net)/.test(it);
						obj.content = it;
						if(obj.isCode){
							obj.content = marked('```'+contentArr[1]+'```');
						}
						contentList.push(obj)
					})
					lastItem.contentList = contentList
				}
				lastItem.isEnd = true;
				isConnect.value = false;
				nextTick(scrollBottom)
			}
		});
	})
	onShow(()=>{
		let token = uni.getStorageSync('token');
		if(!token){
			// return uni.navigateTo({
			// 	url:'/pages/login/appLogin'
			// })
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
			
		}
		userInfo().then(res=>{
			let data = res.data;
			user.avatar = data.avatar||avatarDef;
			user.nickName = data.nickName;	
		})
		initHighLight();
	})
	
	onUnload(()=>{
		// console.log('on unload fn');
		let token = uni.getStorageSync('token');
		uni.closeSocket({
			url: env.BASE_WS+'/api/websocket/'+token, 
			success:(res)=>{
				console.log('closeSocket success')
			}
		})
	})
	
	const tempBtn = (msg)=>{
		content.value = msg;
		sendBtn();
	}
	const goPage = (url)=>{
		uni.navigateTo({
			url
		})
	}
	const user = reactive({
		nickName:'',
		avatar:'',
	})
	const aiUser = reactive({
		nickName:'小助手',
		avatar:aislogo,
	})
	const getHotQS = () =>{
		hotArray.length = 0;
		queryHotQs().then(res=>{
			if(res.data.length>3){
				res.data.length = 3
			}
			hotArray.push(...res.data);
		})
	}
	const copyContentBtn = (item)=>{
		copyContent(item);
	}
	const sendBtn = ()=>{
		if(isConnect.value){ return; }
		if(!content.value){
			return toast("发送内容不能为空")
		}
		
		let data = {
			msg:content.value,
			modelId:modelId.value,
		}
		wssIsConnect = false;
		uni.sendSocketMessage({
			data:JSON.stringify(data),
			success() {
				chatList.push({
					modelRole:user.nickName,
					avatarImg:user.avatar,
					self:1,
					id:+new Date(),
					content:content.value,
				})
				content.value = '';
				chatList.push({
					modelRole:aiUser.nickName,
					avatarImg:aiUser.avatar,
					self:0,
					id:+new Date(),
					content:'正在思考中...',
					isEnd:false,
				})
				nextTick(scrollBottom)
			}
		})
		setTimeout(()=>{
			if(!wssIsConnect){
				toast("wss连接已断开，请退出页面重新进入")
			}
		},5000)
		
	}
	
	function scrollBottom(){
		const query = uni.createSelectorQuery()
		query
			.select('.page-top')
			.boundingClientRect((data) => {
				// console.log("scroll bottom data",data.height);
				let pageScrollTop = Math.round(data.height);
				uni.pageScrollTo({
					scrollTop: pageScrollTop, //滚动的距离
					duration: 0, //过渡时间
			})
		}).exec()
	}
	
	
	
	const chatList = reactive([]),modelId = ref('')
	
	
	
	
	const content = ref('');
	//复制文本
	const copyBtn = ()=>{
		// #ifdef H5
		let textarea = document.createElement("textarea")
		textarea.value = textContent.value; 
		textarea.readOnly = "readOnly"
		document.body.appendChild(textarea)
		textarea.select() // 选中文本内容
		textarea.setSelectionRange(0, textContent.value.length) 
		uni.showToast({//提示
			title:'复制成功' ,
			icon:'success'
		})
		document.execCommand("copy") 
		textarea.remove();
		// #endif
		// #ifndef H5
		uni.setClipboardData({
		  data:this.textContent.value,//要被复制的内容
		  success:()=>{//复制成功的回调函数
			uni.showToast({//提示
			  title:`复制成功`,
			  icon:'success'
			})
		  }
		},true);
		// #endif
	}

		
	
</script>

<style lang="scss" scoped>
	.page{
		background-color: #F5F5F5;
		min-height:100vh;
		padding-top:30rpx;
	}
	.markdown-box{
		padding:10rpx;
		background-color: #F4F5F6;
	}
	.icon-refresh{
		height: 32rpx;
		width:32rpx;
		margin-left: 8rpx;
	}
	.loading-box{
		height: 160rpx;
		padding-top:50rpx;
		.loading-img{
			width: 60rpx;
			height: 60rpx;
			display: block;
			margin:0 auto;
			animation: circle 1s linear infinite;
		}
	}
	.chat-box{
		display: flex;
		&+.chat-box{
			margin-top:20rpx;
		}
		@keyframes shine{
			0%{opacity: 1;}
			50%{opacity: .1;}
			0%{opacity: 1;}
		}
		.move-cursor{
			&::after{
				content:"|";
				animation: shine cubic-bezier(0.215, 0.610, 0.355, 1) 1s infinite;
			}
		}
		.avatar-img{
			width:90rpx;
			height:90rpx;
			border-radius: 50%;
			
			margin-right:12rpx;
		}
		.ques-tips{
			color:$theme-color;
			font-size: 26rpx;
			margin-top: 8rpx;
		}
		
		.temp-content{
			padding:20rpx;
			width:480rpx;
			border-radius: 12rpx;
			background-color: #FFF;
			line-height: 1.45;
			margin-top:8rpx;
		}
		
		&.flex-end{
			flex-direction: row-reverse;
			justify-content: flex-end;
			padding-left:104rpx;
			
			.title{
				text-align: right;
				width:480rpx;
			}
			.avatar-img{
				margin-left:12rpx;
				margin-right:0;
			}
			
			
			.say-content-box{
				margin-right:0;
				width:480rpx;
				display: flex;
				justify-content: flex-end;
				
				.say-content{

					padding:20rpx;
					max-width:480rpx;
					border-radius: 12rpx;
					background-color: #FFF;
					line-height: 1.45;
					margin-top:8rpx;
				}
				
			}
		}
		
	}
	.say-content.item-content{
		width:480rpx;
	}
	.footer-margin{
		height:230rpx;
	}
	.footer-input-box{
		position: fixed;
		bottom:0;
		left:0;
		width:100%;
		background-color: #FFFFFF;
		
		.footer-btns{
			position: absolute;
			top: -80rpx;
			width:690rpx;
			.btn{
				font-size: 26rpx;
				line-height:60rpx;
				border-radius: 10rpx;
				&.btn{
					margin-left:12rpx;
				}
			}
		}
		
		.form-input{
			flex:1;
			font-size: 28rpx;
		}
		.send-btn{
			width:140rpx;
			height: 66rpx;
			border-radius: 33rpx;
			display: flex;
			&.disabled{
				opacity: .5;
			}
		}
	}
	.scroll-view{
		height:calc(100vh - var(--top-window-height) - var(--tab-bar-height) )
	}
	.mask-box{
		width:100vw;
		height: 100vh;
		position: fixed;
		top:0;
		left:0;
		z-index: 12;
		background-color: rgba(0,0,0,.15);
		.mask-content{
			background-color: #FFFFFF;
			position: absolute;
			border-radius: 20rpx 20rpx 0 0;
			left:0;
			bottom: 0;
			width: 100vw;
			padding:30rpx 0;
		}
		.mask-title{
			text-align: center;
			position: relative;
			padding:0 30rpx;
			.icon-close{
				position: absolute;
				width: 32rpx;
				height: 32rpx;
				top:4rpx;
				right:32rpx;
			}
		}
		.mode-list{
			height: 500rpx;
			overflow-y: scroll;
			padding:0 30rpx;
			
			.mode-item{
				display: flex;
				// align-items: center;
				& + .mode-item{
					margin-top: 16rpx;
				}
				
				.icon-avatar{
					width:120rpx;
					height: 120rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
				}
				.mode-info{
					flex:1;
					height: 120rpx;
				}
				.mode-radio{
					margin-top:24rpx;
					background-color: $blue;
					height:60rpx;
					width:120rpx;
					color:#FFF;
					border-radius: 12rpx;
				}
			}
		}
	
	}

</style>
