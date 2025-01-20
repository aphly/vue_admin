<template>
    <div>
        <a-drawer
            :title="drawer.form.uid?'编辑':'新增'"
            :open="props.open"
            @close="drawerClose"
            @afterOpenChange = "afterOpenChange"
        >
            <a-form ref="formRef" :model="drawer.form" :rules="drawer.rules" layout="vertical">
                
                <div v-if="drawer.form.uid">
                    <a-form-item label="Uid" name="uid">
                        <a-input :disabled="true" v-model:value="drawer.form.uid" />
                    </a-form-item>
                    <ul >
                        <li style="display: flex;" v-for="v,k in props.record.UserAuth" :key="k"><div>{{ v.id_type }} : </div><div>{{ v.id }}</div></li>
                    </ul>
                </div>

                <a-form-item v-if="!drawer.form.uid" label="手机号码" name="id">
                    <a-input v-model:value="drawer.form.id" placeholder="手机号码" />
                </a-form-item>

                <a-form-item label="昵称" name="nickname">
                    <a-input v-model:value="drawer.form.nickname" placeholder="昵称" />
                </a-form-item>

                <a-form-item label="密码" name="password">
                    <a-input v-model:value="drawer.form.password" placeholder="密码" />
                </a-form-item>
                
                <a-form-item label="状态">
                    <a-switch v-model:checked="drawer.form.status" />
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
    import {reactive,defineEmits,ref} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';

    const formRef = ref(null);
    let props =  defineProps(['record','open'])

    const emit = defineEmits(['drawe_close']);

    function drawerClose(){
        emit('drawe_close', false);
    }

    let initForm = {
        id:'',
        uid:'',
        nickname: '',
        password:'',
        status:true,
    }

    const drawer = reactive({
        form:initForm,
        rules : {
            id: [
                {
                required: true,
                message: '手机号码',
                },
            ],
        },
    });

    const save = async() => {
        let saveData = {...drawer.form,status:drawer.form.status?1:0}
        if(props.record.uid){
            let res = await request.post("/common/user/edit",saveData)
            if (res.code){
                return message.info(
                    res.msg
                );
            }else{
                drawerClose()
            }
        }else{
            let res = await request.post("/common/user/add",saveData)
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
            drawer.form ={...initForm}
        }
        if(!b){
            formRef.value.resetFields()
        }
    }

    
</script>

<style lang="scss" scoped>

</style>