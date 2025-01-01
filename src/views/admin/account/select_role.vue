<template>
  <div class="selectRole">
    <div class="loginStatus1" @click="router.push('/admin/account/index')" style="cursor: pointer;margin-bottom: 10px;">
        {{ manager.info.username }}
    </div>
    <div class="text">请选择角色</div>
    <ul >
      <li v-for="item,key in list" :key="key" >
        <a-button class="adminBtn"  @click="chooseRole(item.Role)">{{ item.Role.title }}</a-button>
      </li>
    </ul>
    <div class="loginStatus">
      <div class="loginStatus2" >
        <a-button @click="manager.logout();router.push('/admin/login')">退出</a-button>
      </div>
    </div>
  </div>
    
</template>

<script setup>
    import {  ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useManagerStore } from '@/stores/manager'
    let router = useRouter();
    let manager = useManagerStore()
    let manager_role = JSON.parse(localStorage.getItem("manager_role"))
    const list = ref(manager_role);
    async function chooseRole(role){
      localStorage.setItem("manager_role_info",JSON.stringify(role))
      manager.selectRole(role)
      router.push('/admin/layout')
    }
    
</script>

<style lang="scss" scoped>
.selectRole{
  text-align: center;
  width: 200px;
  margin: 20vh auto 0;
  .text{margin-bottom:20px;font-size: 16px;font-weight: 600;}
  ul{margin: 0;
    li{
      padding:0 0 10px 0;cursor: pointer;
    }
    li:hover{
      color:var(--c_color)
    }
  }
  .loginStatus{
    margin-top: 60px;
   
  }
}
</style>