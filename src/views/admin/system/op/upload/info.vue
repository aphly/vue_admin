<template>
    <div>
        <a-drawer
            title="详情"
            :open="props.open"
            @close="drawerClose"
            @afterOpenChange = "afterOpenChange"
        >
            <a-descriptions  bordered :column="1">
                <a-descriptions-item label="id" >{{ drawer.info.id }}</a-descriptions-item>
                <a-descriptions-item label="用户名" >{{ drawer.info.manager_username }}</a-descriptions-item>
                <a-descriptions-item label="层级" >{{ drawer.info.level_title }}</a-descriptions-item>
                <a-descriptions-item label="路径" >{{ drawer.info.path }}</a-descriptions-item>
                <a-descriptions-item label="是否远程" >{{ drawer.info.remote }}</a-descriptions-item>
                <a-descriptions-item label="文件类型" >{{ drawer.info.file_type }}</a-descriptions-item>
                <a-descriptions-item label="文件大小" >{{ convertBytesToSize(drawer.info.file_size) }}</a-descriptions-item>
                <a-descriptions-item label="上传时间" >{{ timestampToTime(drawer.info.created_at) }}</a-descriptions-item>
            </a-descriptions>
        </a-drawer>
    </div>
</template>

<script setup>
    import {reactive,defineEmits} from "vue"
    import {timestampToTime}  from "@/helper/time";
    import {convertBytesToSize}  from "@/helper/file.js";

    let props =  defineProps(['record','open'])

    const emit = defineEmits(['drawe_close']);
   
    function drawerClose(){
        emit('drawe_close', false);
    }

    let initInfo = {
        id:'',
        uid:'',
        level_id:'',
        path:'',
        file_type:'',
        file_size:0,
        remote:0,
        created_at:0,
    }

    const drawer = reactive({
        open:false,
        info:initInfo,
    });

    function afterOpenChange(b){
        if(props.record.id){
            drawer.info = props.record
        }else{
            drawer.info = initInfo
        }
    }
    
</script>

<style lang="scss" scoped>

</style>