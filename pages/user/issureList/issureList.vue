<template>
	<view class="pad page page-top">

		<view class="issure-item bg-white radius-20 px-20 py-20 bg-white" v-for="item in dataArray" :key="item">
			<view class="issure-title">
				问：{{item.question}}
			</view>
			<view class="content-box" >
				<view class="content-info" :class="{lock:!item.flag && item.answer.length>150}">
					<text class="c-6 font-24">
						{{item.answer}}
					</text>
				</view>
				
				<view class="mask-box"  >
					<view class="mask-shadow" v-show="!item.flag"></view>
					<view class="mask-title" @click="toggleFlag(item)">
						{{item.flag?'收起全文':'展开阅读全文'}}
					</view>
				</view>
				<view class="tips-box">
					AI智能回答时间：{{item.createTime}}
				</view>
				<view class="sumbit-box mt-20 flex-end flex-row">
					<view class="btn copy-btn primary" @click="copyContentBtn(item.answer)">
						一键复制
					</view>
					<!-- <view class="btn share-btn">
						生成海报
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { onMounted, reactive } from "vue";
	import { onReady,onShow } from "@dcloudio/uni-app";
	import { queryQuestionAnswerList } from '@/http/index.js'
	import {setNavigation,copyContent} from '@/utils/tools.js'
	export default {
		data() {
			return {
				dataArray: []
			}
		},
		methods: {
			copyContentBtn(content){
				copyContent(content)
			},
			toggleFlag(item){
				item.flag = !item.flag
			},
		},
		onReady() {
			setNavigation();
		  queryQuestionAnswerList().then(res=>{
			// dataArray = res.data;
			res.data.map(item=>{
				item.flag = false;
			})
			this.dataArray.push(...res.data)
			console.log(this.dataArray)
			
		   })
		},
		
	}
</script>

<style lang="scss" scoped>
.page-top{
	padding-top:30rpx;
}
.bg-white{
	background-color: #FFFFFF;
}
.issure-item{
	margin-bottom:20rpx;
}
.issure-title{
	border-bottom:1px solid #F5F5F5;
	line-height: 60rpx;
	// height: 60rpx;
	color:#333333;
	font-size:30rpx;
}
.tips-box{
	color:$theme-color;
	background-color: rgba($theme-color,.1);
	font-size: 26rpx;
	padding:10rpx 8rpx;
	border-radius: 12rpx;
}
.mask-box{
	position: relative;
	.mask-shadow{
		position: absolute;
		left:0;
		bottom:50rpx;
		height:120rpx;
		width:650rpx;
		background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 80%);
	}
}
.sumbit-box{
	.btn{
		width:300rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 20rpx;
		text-align: center;
	}
	.share-btn{
		background-color: $yellow;
		color:#FFFFFF;
	}
}
.content-box{
	padding-top:20rpx;
	padding-bottom:20rpx;
	.content-info{
		&.lock{
			height:200rpx;
			overflow: hidden;
		}
	}
	
}
.mask-title{
	text-align: center;
	color:$theme-color;
	height: 60rpx;
	line-height: 60rpx;
}
</style>
