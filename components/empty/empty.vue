<template>
	<view class="empty-box flex-row flex-center">
		<view class="empty-info">
			<image src="@/static/img/empty.png" class="empty-img" mode=""></image>
			<view class="mt-16 c-9 font-24 text-center">
				{{emptyText||'暂无数据'}}
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['emptyText'],//置空文字
	}
</script>

<style scoped lang="scss">
	.empty-box{
		height: 750rpx;
		.empty-img{
			width: 240rpx;
			height:240rpx;
			position: relative;
			left:-10rpx;
		}
	}
	
</style>