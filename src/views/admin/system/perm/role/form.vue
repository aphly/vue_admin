<template>
    <div>
        <a-drawer
            :title="drawer.form.id?'编辑':'新增'"
            :width="720"
            :open="props.open"
            :body-style="{ paddingBottom: '80px' }"
            :footer-style="{ textAlign: 'right' }"
            @close="drawerClose"
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
                <a-form-item label="描述">
                    <a-input v-model:value="drawer.form.desc" placeholder="描述" />
                </a-form-item>
                <a-form-item label="数据权限" >
                    <a-radio-group v-model:value="drawer.form.data_perm">
                        <a-radio-button value="1">自己</a-radio-button>
                        <a-radio-button value="2">本级</a-radio-button>
                        <a-radio-button value="3">本级以及下级</a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="层级">
                    <a-tree-select
                        v-model:value="drawer.form.level_id"
                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                        placeholder="请选择"
                        :tree-data="drawer.levelTreeData"
                    >
                    </a-tree-select>
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
    import {reactive,defineEmits,ref ,onBeforeMount} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';

    const formRef = ref(null);
    let props =  defineProps(['record','open','levelTreeData'])

    const emit = defineEmits(['drawe_close']);
   
    function drawerClose(){
        emit('drawe_close', false);
    }

    let initForm = {
        id:0,
        title: '',
        desc:'',
        pid:0,
        data_perm:'1',
        sort:0,
        status:true,
        level_id:'',
    }

    const drawer = reactive({
        open:false,
        form:initForm,
        rules : {
            name: [
                {
                required: true,
                message: 'Please enter user name',
                },
            ],
            sort: [
                {
                message: 'Please enter user name',
                },
            ],
        },
        levelTreeData:[]
    });

    const save = async() => {
        let saveData = {...drawer.form,status:drawer.form.status?1:0,data_perm:parseInt(drawer.form.data_perm),level_id:parseInt(drawer.form.level_id)}
        if(props.record.id){
            let res = await request.post("/admin/system/perm/role/edit",saveData)
            if (res.code){
                return message.info(
                    res.msg
                );
            }else{
                drawerClose()
            }
        }else{
            let res = await request.post("/admin/system/perm/role/add",saveData)
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
            drawer.form = initForm
        }
        if(!b){
            formRef.value.resetFields()
        }
    }

    
</script>

<style lang="scss" scoped>

</style>