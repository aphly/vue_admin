<template>
    <div>
        <a-drawer
            :title="drawer.form.uid?'编辑':'新增'"
            :open="props.open"
            @close="drawerClose"
            @afterOpenChange = "afterOpenChange"
        >
            <a-form ref="formRef" :model="drawer.form" :rules="drawer.rules" layout="vertical">
                <div v-if="drawer.form.id">
                    <a-form-item label="Uid" >
                        <a-input :disabled="true" v-model:value="drawer.form.uid" />
                    </a-form-item>
                </div>
                <a-form-item label="用户名" name="username">
                    <a-input v-model:value="drawer.form.username" placeholder="用户名" />
                </a-form-item>
                <a-form-item label="昵称" name="nickname">
                    <a-input v-model:value="drawer.form.nickname" placeholder="昵称" />
                </a-form-item>
                <a-form-item label="手机号码">
                    <a-input v-model:value="drawer.form.phone" placeholder="手机号码" />
                </a-form-item>
                <a-form-item label="密码" name="password">
                    <a-input v-model:value="drawer.form.password" placeholder="密码" />
                </a-form-item>
                
                <a-form-item label="描述">
                    <a-input v-model:value="drawer.form.note"  />
                </a-form-item>
            </a-form>
            <template #extra>
            <a-space>
                <a-button type="primary" @click="save">保存</a-button>
            </a-space>
            </template>
        </a-drawer>
    </div>
</template>

<script setup>
    import {reactive,defineEmits,ref ,onBeforeMount} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    import  {allToSelect}  from '@/helper/tree.js';

    const formRef = ref(null);
    let props =  defineProps(['record','open'])

    const emit = defineEmits(['drawe_close']);
   
    function drawerClose(){
        emit('drawe_close', false);
    }

    let initForm = {
        uid:'',
        username: '',
        nickname:'',
        phone:'',
        note:'',
        password:'',
    }

    const drawer = reactive({
        open:false,
        form:initForm,
        rules : {
            username: [
                {
                    required: true,
                    message: '请输入用户名',
                },
            ],
           
            nickname: [
                {
                    required: true,
                    message: '请输入昵称',
                },
            ],
        },
    });

    const save = async() => {
        let saveData = {...drawer.form}
        if(props.record.uid){
            let res = await request.post("/admin/system/perm/manager/edit",saveData)
            if (res.code){
                return message.info(
                    res.msg
                );
            }else{
                drawerClose()
            }
        }else{
            let res = await request.post("/admin/system/perm/manager/add",saveData)
            if (res.code){
                return message.info(
                    res.msg
                );
            }else{
                drawerClose()
            }
        }
      
    };

    function afterOpenChange(b){
        if(props.record.uid){
            drawer.form = props.record
        }else{
            drawer.form = initForm
        }
        if(!b){
            formRef.value.resetFields()
        }
    }

    // onBeforeMount(async()=>{
    //     let res = await request.get("/admin/system/perm/level/all")
    //     if (!res.code){
    //         drawer.levelTreeData = allToSelect(res.data.list)
    //     }
    // })
    
</script>

<style lang="scss" scoped>

</style>