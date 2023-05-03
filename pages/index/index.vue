<template>
	<view class="content pad">
		<view class="pt-20">
			📝 直接提问
		</view>
		<view class="input-box  mt-16 pad-16">
			<textarea  :rows="4" class="input-text-area font-26" placeholder="请输入问题" v-model="content"></textarea>
			<view class="sumbit-box flex-row flex-end mt-10">
				<button class="btn" @click="cleQs">清空</button>
				<button class="btn primary ml-20" @click="subQs">提交问题</button>
			</view>
		</view>
		<view class="flex space-between mt-30">
			<view class="left">
				🔥 热门提问
			</view>
			<view class="flex-row flex-align c-9" @click="changeQS">
				换一换<image src="@/static/img/refresh.png" class="icon-refresh" mode=""></image>
			</view>
		</view>
		<view class="list-content mt-16">
			<view class="item text-line1 bg-gray" @click="hotChoose(item)" v-for="item in hotQS" :key="item.id">
				{{item.hotQs}}
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, toRefs, reactive,	getCurrentInstance } from 'vue'
	import {	onLoad } from '@dcloudio/uni-app'
	import { toast , randerArray } from '@/utils/tools.js'
	import {queryHotQs} from '@/http/index.js'
	const hotQS = reactive([]);
	const allHotQS = reactive([]);
	onLoad(()=>{
		queryHotQs().then(res=>{
			let dataArray = randerArray(res.data, 4);
			hotQS.push (...dataArray) ;
		})
		
	})
	


	const hotChoose = (item)=>{
		console.log("item.hotQs: ",item.hotQs);
		uni.setStorageSync('tmpContent',item.hotQs);
		uni.navigateTo({
			url:'/pages/issureTmp/issureTmp'
		})
	}
	const content = ref(''), isLoading = ref(false);
	function subQs(){
		if(!content.value){
			return toast('请输入问题')
		}
		uni.setStorageSync('tmpContent',content.value);
		uni.navigateTo({
			url:'/pages/issureTmp/issureTmp'
		})
	}
	function cleQs(){
		content.value ='';
	}


	const changeQS = ()=>{
		hotQS.length = 0,
		allHotQS.length = 0;
		queryHotQs().then(res=>{
			let dataArray = randerArray(res.data, 4);
			hotQS.push (...dataArray);
		})

	}
</script>

<style lang="scss" scoped>
.input-box{
	box-shadow: 0 0 5px #999999;
	border-radius: 10rpx;
	.sumbit-box{
		.btn{
			// width:120rpx;
		}
	}
}
.icon-refresh{
	width:30rpx;
	height: 30rpx;
	margin-left:8rpx;
}

.list-content{
		.item{
			color:$theme-color;
			line-height: 80rpx;
			font-size: 28rpx;
			padding:0 20rpx;
			border-radius: 8rpx;
			&+.item{
				margin-top:20rpx;
			}
		}
	}
	.moban-box{
		.item{
			width:332rpx;
			box-sizing: border-box;
		}
	}
</style>
