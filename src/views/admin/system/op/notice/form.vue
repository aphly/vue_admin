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

                <a-form-item label="类型" name="dict_value">
                    <a-select v-model:value="drawer.form.dict_value">
                        <a-select-option :key="k" :value="v.value" v-for="(v,k) in props.common.dictValueData">{{ v.title }}</a-select-option>
                    </a-select>
                </a-form-item>
                
                <a-form-item label="层级" name="level_id">
                    <a-tree-select
                        v-model:value="drawer.form.level_id"
                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                        placeholder="请选择"
                        :tree-data="props.common.levelTreeData"
                    >
                    </a-tree-select>
                </a-form-item>

                <a-form-item label="内容" name="content">
                    <a-textarea v-model:value="drawer.form.content" />
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
    let props =  defineProps(['record','open','common'])

    const emit = defineEmits(['drawe_close']);
   
    function drawerClose(){
        emit('drawe_close', false);
    }

    let initForm = {
        id:0,
        title: '',
        content:'',
        status:true,
        dict_value:'',
        level_id:'',
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
        },
    });

    const save = async() => {
        let saveData = {...drawer.form,status:drawer.form.status?1:0,level_id:parseInt(drawer.form.level_id)}
        if(props.record.id){
            let res = await request.post("/admin/system/op/notice/edit",saveData)
            if (res.code){
                return message.info(
                    res.msg
                );
            }else{
                drawerClose()
            }
        }else{
            let res = await request.post("/admin/system/op/notice/add",saveData)
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