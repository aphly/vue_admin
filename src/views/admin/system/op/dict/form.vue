<template>
    <div>
        <a-drawer
            :title="drawer.form.id?'编辑':'新增'"
            :open="props.open"
            @close="drawerClose"
            @afterOpenChange = "afterOpenChange"
        >
            <a-form ref="formRef" :model="drawer.form" :rules="drawer.rules" layout="vertical">
                <div v-if="drawer.form.id">
                    <a-form-item label="Id" name="id">
                        <a-input :disabled="true" v-model:value="drawer.form.id" />
                    </a-form-item>
                </div>
                <a-form-item label="名称" name="title">
                    <a-input v-model:value="drawer.form.title" placeholder="名称" />
                </a-form-item>
                <a-form-item label="name" name="name">
                    <a-input v-model:value="drawer.form.name" placeholder="name" />
                </a-form-item>
                
                <a-form-item label="排序">
                    <a-input-number v-model:value="drawer.form.sort" :min="0" :max="10000" />
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
    import {reactive,defineEmits,ref } from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';

    const formRef = ref(null);
    let props =  defineProps(['record','open'])

    const emit = defineEmits(['drawe_close']);
   
    function drawerClose(){
        emit('drawe_close', false);
    }

    let initForm = {
        id:0,
        title: '',
        name:'',
        sort:0,
        status:true,
    }

    const drawer = reactive({
        open:false,
        form:initForm,
        rules : {
            title: [
                {
                required: true,
                message: '请输入名称',
                },
            ],
            name: [
                {
                required: true,
                message: '请输入name',
                },
            ],
        },
        levelTreeData:[]
    });

    const save = async() => {
        let saveData = {...drawer.form,status:drawer.form.status?1:0}
        if(props.record.id){
            let res = await request.post("/admin/system/op/dict/edit",saveData)
            if (res.code){
                return message.info(
                    res.msg
                );
            }else{
                drawerClose()
            }
        }else{
            let res = await request.post("/admin/system/op/dict/add",saveData)
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
        drawer.levelTreeData = props.levelTreeData
        if(props.record.id){
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