<template>
    <div class="adminMain">
      <div class="adminMainTitle">个人资料</div>
      <a-form :model="form" class="box" layout="vertical">
        <a-form-item label="用户名">
          <a-input :value="manager.info.username" :disabled="true"/>
        </a-form-item>
        <a-form-item label="Uid">
          <a-input :value="manager.info.uid" :disabled="true"/>
        </a-form-item>
        <a-form-item label="昵称" name="nickname">
            <a-input v-model:value="form.nickname" placeholder="昵称" />
        </a-form-item>
        <a-form-item label="手机号码">
            <a-input v-model:value="form.phone" placeholder="手机号码" />
        </a-form-item>
        <a-form-item label="密码" name="password">
            <a-input v-model:value="form.password" type="password" placeholder="密码" />
        </a-form-item>
        <a-form-item >
          <a-button class="adminBtn" @click="onSubmit">保存</a-button>
        </a-form-item>
      </a-form>

      <div class="box" style="margin-top: 20px;">
        <div class="adminMainTitle">切换头像</div>
        <ul class="avatar" style="">
          <li v-for="item,key in avatarArr" :key="key" @click="chooseAvatar(item)">
              <img :src="getImageUrl(item)" alt="">
          </li>
        </ul>
      </div>

    </div>
      
  </template>
  
  <script setup>
      import {  ref,reactive } from 'vue';
      import { useRouter } from 'vue-router';
      import { useManagerStore } from '@/stores/manager'
      import  request  from '@/helper/request.js';
      import { message } from 'ant-design-vue';
      let manager = useManagerStore()
      const modules = import.meta.glob('/src/assets/image/avatar/*.png')
      let modulesH = Object.keys(modules).map(str=>{
        return str.replace("/src/assets/image/avatar/",'')
      })

      let avatarArr = ref(modulesH)

      let initForm = {
          nickname:manager.info.nickname,
          phone:manager.info.phone,
          password:'',
      }
      const form = reactive(initForm);

      function getImageUrl(name) {
        return new URL(`/src/assets/image/avatar/${name}`, import.meta.url).href
      }

      async function onSubmit(){
        let res = await request.post("/admin/account/index",form)
        if(!res.code){
          manager.updateManagerInfo(res.data.manager_info)
          return message.success(
                res.msg
          );
        }else{
          return message.info(
              res.msg
          );
        }
      }

      async function chooseAvatar(id){
        let res = await request.post("/admin/account/avatar",{avatar_id:id})
        if(!res.code){
            localStorage.setItem('manager_avatar',id)
            manager.selectAvatar(id)
        }else{
            return message.info(
                res.msg
            );
        }
      }
      
  </script>
  
  <style lang="scss" scoped>
  .avatar{
    
    display: flex;
    flex-wrap: wrap;
    li{
      width: 100px;height: 100px;margin-right:10px;cursor: pointer;
      img{
        width: 100%;height: 100%;border-radius: 4px;
      }
    }
  }
  </style>