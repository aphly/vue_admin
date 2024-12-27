<template>
    <div>
        <a-drawer
            :title="drawer.form.id?'编辑':'新增'"
            :open="props.open"
            @close="drawerValueFormClose"
            @afterOpenChange = "afterOpenChange"
        >
            <a-form ref="formRef" :model="drawer.form" :rules="drawer.rules" layout="vertical">
                <div v-if="drawer.form.id">
                    <a-form-item label="Id" name="id">
                        <a-input :disabled="true" v-model:value="drawer.form.id" />
                    </a-form-item>
                </div>
                <a-form-item label="名称">
                    <a-input v-model:value="drawer.form.title" placeholder="名称" />
                </a-form-item>
                <a-form-item label="值">
                    <a-input v-model:value="drawer.form.value" placeholder="值" />
                </a-form-item>
                <a-form-item label="排序">
                    <a-input-number v-model:value="drawer.form.sort" :min="0" :max="10000" />
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

    const emit = defineEmits(['drawe_value_form_close']);
   
    function drawerValueFormClose(){
        emit('drawe_value_form_close', false);
    }

    let initForm = {
        id:0,
        title: '',
        value:'',
        sort:0,
        dict_id:0
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
            value: [
                {
                required: true,
                message: '请输入值',
                },
            ],
        },
    });

    const save = async() => {
        let saveData = {...drawer.form}
        if(props.record.id){
            let res = await request.post("/admin/system/op/dict/value_edit",saveData)
            if (res.code){
                return message.info(
                    res.msg
                );
            }
        }else{
            let res = await request.post("/admin/system/op/dict/value_add",saveData)
            if (res.code){
                return message.info(
                    res.msg
                );
            }
        }
        drawerValueFormClose()
    };

    function afterOpenChange(b){
        if(props.record.id){
            drawer.form = props.record
        }else{
            drawer.form = {...initForm}
            drawer.form.dict_id = props.record.dict_id
        }
        if(!b){
            formRef.value.resetFields()
        }
    }

    
</script>

<style lang="scss" scoped>

</style>