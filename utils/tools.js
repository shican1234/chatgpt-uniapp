// import wxjsSdk from 'weixin-js-sdk'
export const setNavigation = ()=>{
	console.log('set navigation')
	uni.setNavigationBarColor({
		frontColor: '#ffffff',
		backgroundColor: '#26b3a0'
	})
}

export const toast = (msg) => {
	uni.showToast({
		title:msg,
		icon:'none'
	})
}
export const randerArray = (data,num)=>{
	let dataArray = [];
	for(var i=0;i<num;i++){
		let index = Math.floor((Math.random()*data.length));
		var element = data[index];
		dataArray.push(element);
		data.splice(index,1)
	}
	return dataArray;
}
export const copyContent = (text) => {
	// #ifdef H5
	let textarea = document.createElement("textarea")
	textarea.value = text 
	textarea.readOnly = "readOnly"
	document.body.appendChild(textarea)
	textarea.select() // 选中文本内容
	textarea.setSelectionRange(0, text.length) 
	uni.showToast({//提示
		title:'复制成功' ,
		icon:'none'
	})
	document.execCommand("copy") 
	textarea.remove()
	// #endif
	
	// #ifndef H5
	uni.setClipboardData({
	  data:text,//要被复制的内容
	  success:()=>{//复制成功的回调函数
		uni.showToast({//提示
		  title:`复制成功`,
		  icon:'icon'
		})
	  }
	},true);
	// #endif
}
export const copyUrl = (text) => {
	// #ifdef H5
	let textarea = document.createElement("textarea")
	textarea.value = text 
	textarea.readOnly = "readOnly"
	document.body.appendChild(textarea)
	textarea.select() // 选中文本内容
	textarea.setSelectionRange(0, text.length) 
	uni.showToast({//提示
		title:'邀请链接复制成功' ,
		icon:'success'
	})
	document.execCommand("copy") 
	textarea.remove()
	// #endif
	
	// #ifndef H5
	uni.setClipboardData({
	  data:text,//要被复制的内容
	  success:()=>{//复制成功的回调函数
		uni.showToast({//提示
		  title:`邀请链接复制成功`,
		  icon:'icon'
		})
	  }
	},true);
	// #endif
}
export function vipDayCalc(time){
	if(!time) return 0;
	time = time.replace(/-/g,'/');
	let timeDiff = new Date(time).getTime() - new Date().getTime();
	let count = 0
	if(timeDiff>0){
		count = parseInt(timeDiff/8.64e7);
	}
	return count;
}
//判断登录页面跳转
export function toLogin(time){
	console.log('utils tologin')
	// app 跳转
	// #ifdef APP-PLUS
	uni.navigateTo({
		url:'/pages/login/appLogin'
	})
	// #endif
	/* 小程序登录 */
	// #ifdef MP
	uni.navigateTo({
		url:'/pages/login/login'
	})
	// #endif
	/* h5 */ 
	// #ifdef H5
	console.log('h5登录')
	//区分微信公众号 和 普通的H5登录
	let ua = navigator.userAgent
	if (ua.match(/MicroMessenger/i)=="micromessenger") {
			uni.navigateTo({
				url:'/pages/login/login'
			})
			// wxjsSdk.miniProgram.getEnv((res) => {
			// 		if (res.miniprogram) {
			// 			console.log('在小程序内');
			// 		} else {
			// 				console.log('不在小程序内');
			// 		}
			// })
		}else{
			console.log('h5登录 不是微信')
			uni.navigateTo({
				url:'/pages/login/login'
			})
		}
	// #endif
	
}