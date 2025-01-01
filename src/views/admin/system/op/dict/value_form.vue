<template>
    <div>
        <a-modal v-model:open="open" :title="drawer.form.id?'编辑':'新增'" @cancel="drawerValueFormClose" :footer="null">

            <a-form ref="VformRef" :model="drawer.form" :rules="drawer.rules" layout="vertical">
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
            <div>
                <a-button type="primary" @click="save">保存</a-button>
            </div>
            
        </a-modal>
    </div>
</template>

<script setup>
    import {reactive,defineEmits,ref,onMounted,onUnmounted, watch} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';

    const VformRef = ref(null);
    let props =  defineProps(['record','open'])

    const emit = defineEmits(['drawe_value_form_close']);
   
    function drawerValueFormClose(){
        emit('drawe_value_form_close', false);
    }

    let open = ref(false)

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

    watch(() => props.open, (newVal, oldVal) => {
        if(newVal){
            open.value = true
            if(props.record.id){
                drawer.form = props.record
            }else{
                drawer.form = {...initForm}
                drawer.form.dict_id = props.record.dict_id
            }
        }else{
            open.value = false
            VformRef.value.resetFields()
        }
    })

    // onMounted(()=>{
    //     console.log("open")
    //     
    // })

    // onUnmounted(()=>{
    //     console.log("close")
    //    
    // })
   
</script>

<style lang="scss" scoped>

</style>