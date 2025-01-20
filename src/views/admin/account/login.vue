<template>
    <div class="login ">
        <div class="login1">
            <span>
                " 相伴十载，出发下一站 "
            </span>
        </div>
        <div class="login2">
            <div class="login_form">
                <div class="login_title">
                    <span class="text-center">登录</span>
                </div>
                <a-form layout="vertical" :model="form" >
                    <a-form-item label="用户名" style="">
                        <a-input size="large" v-model:value="form.username" placeholder="用户名" />
                    </a-form-item>
                    <a-form-item label="密码" style="margin-bottom:10px;">
                        <a-input size="large" type="password" v-model:value="form.password" placeholder="密码" />
                    </a-form-item>
                </a-form>
                <div class="login_btn">
                    <a-button type="primary" size="large" class="adminBtn" @click="login">登录</a-button>
                </div>
                <div class="login_other">
                    <hr class="login_hr">
                    <p>©{{ loginPage.year }} - {{ loginPage.host }}. All rights reserved.</p>
                    <p>推荐使用 新版浏览器 访问本站</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { reactive } from 'vue';
    import { message } from 'ant-design-vue';
    import  request  from '@/helper/request.js';
    import { useManagerStore } from '@/stores/manager';
    import { useRouter } from 'vue-router';
    import {config} from '@/config/index.js';
    let loginPage = reactive({
      host: config.ApiHOST,
      year :new Date().getFullYear()
    });
    const form = reactive({
      username: '',
      password: '',
    });
    let router = useRouter();
    const manager = useManagerStore()
    async function login(){
        let res = await request.post("/admin/login",form)
        if(!res.code){
            manager.login(res.data.manager,res.data.token,res.data.manager_role)
            message.success(
                res.msg
            );
            router.push('/admin/select_role')
        }else{
            message.info(
                res.msg
            );
        }
    }
</script>

<style lang="scss" scoped>
.login{height:100vh;display: flex;}
.login1{width:60%;background:#5e8ee7;color:#fff;height:100%;font-size:34px;font-weight:600;justify-content:center;display:flex;align-items:center}
.login2{width:40%;background:#f6f8fb;overflow-y: auto;}
.login_form{
    width:80%;margin:0 10%;
    .ant-form-item{margin-bottom: 10px;}
    .form-control{height:50px;line-height:50px}
    .form-group{margin-top:24px;margin-bottom:5px}
    p{margin-bottom:5px}
}
.login_title{font-size:36px;line-height:40px;color:#4f5464;margin-bottom:48px;margin-top:80px}
.login_btn{margin-top:30px}
.login_btn button{width:100%;height:42px}
.login_other .login_hr{width:calc(100% - 30px);margin-left:15px;border-top:1px solid rgba(0,0,0,.1);margin-bottom: 20px;}
.login_other{margin:30px 0;position: relative;}
@media (max-width: 1200px) {
    .login1{display: none;}
    .login2{width: 100%;}
}
</style>