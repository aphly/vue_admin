import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => {
		return { 
			loginStatus:false,
			info:{} , 
			token:{},
		};
	},
	actions: {
		init(){
			let userInfo = localStorage.getItem('user_info')
			if(userInfo){
				userInfo = JSON.parse(userInfo)
				this.info = userInfo;
			}

			let userToken = localStorage.getItem('user_token')
			if(userToken){
				userToken = JSON.parse(userToken)
				this.token = userToken;
				this.loginStatus = true;
			}
		},
		updateUserInfo(userInfo){
			this.info = userInfo;
			localStorage.setItem('user_info',JSON.stringify(userInfo))
		},
		updateAccessToken(access_token){
			let userToken = localStorage.getItem('user_token')
			if(userToken){
				userToken = JSON.parse(userToken)
				userToken['access_token'] = access_token
				this.token = userToken;
				localStorage.setItem('user_token',JSON.stringify(userToken))
			}
		},
		login(userInfo,token) {
			this.info = userInfo;
			this.loginStatus = true;
			localStorage.setItem('user_info',JSON.stringify(this.info))
			this.token = token;
			localStorage.setItem('user_token',JSON.stringify(token))
		},
		logout(){
			this.loginStatus=false;
			this.info={};
			this.token={};
			localStorage.clear()
		},
	},
	
});