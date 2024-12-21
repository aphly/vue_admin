import { defineStore } from 'pinia';

export const useManagerStore = defineStore('manager', {
	state: () => {
		return { 
			loginStatus:false,
			info:{} , 
			token:{},
			roleInfo:{} , 
			avatar:'1.png',
		};
	},
	actions: {
		init(){
			let managerInfo = localStorage.getItem('manager_info')
			if(managerInfo){
				managerInfo = JSON.parse(managerInfo)
				this.info = managerInfo;
			}

			let managerToken = localStorage.getItem('manager_token')
			if(managerToken){
				managerToken = JSON.parse(managerToken)
				this.token = managerToken;
				this.loginStatus = true;
			}

			let manager_role_info = localStorage.getItem('manager_role_info')
			if(manager_role_info){
				manager_role_info = JSON.parse(manager_role_info)
				this.roleInfo=manager_role_info
			}
			let manager_avatar = localStorage.getItem('manager_avatar')
			if(manager_avatar){
				this.avatar = manager_avatar
			}
		},
		updateManagerInfo(managerInfo){
			this.info = managerInfo;
			localStorage.setItem('manager_info',JSON.stringify(managerInfo))
		},
		updateAccessToken(access_token){
			let managerToken = localStorage.getItem('manager_token')
			if(managerToken){
				managerToken = JSON.parse(managerToken)
				managerToken['access_token'] = access_token
				this.token = managerToken;
				localStorage.setItem('manager_token',JSON.stringify(managerToken))
			}
		},
		login(managerInfo,token,manager_role) {
			this.info = managerInfo;
			this.loginStatus = true;
			localStorage.setItem('manager_info',JSON.stringify(this.info))
			this.token = token;
			localStorage.setItem('manager_token',JSON.stringify(token))
			localStorage.setItem("manager_role",JSON.stringify(manager_role))
			this.avatar=this.info.avatar?this.info.avatar:'1.png'
			localStorage.setItem('manager_avatar',this.avatar)
		},
		logout(){
			this.loginStatus=false;
			this.info={};
			this.token={};
			this.roleInfo={}
			this.avatar='1.png'
			localStorage.clear()
		},
		selectRole(role){
			this.roleInfo=role
		},
		selectAvatar(avatar){
			this.avatar=avatar
		},
	},
	
});