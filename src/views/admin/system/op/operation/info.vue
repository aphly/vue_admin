<template>
    <div>
        <a-drawer
            title="详情"
            :open="props.open"
            @close="drawerClose"
            @afterOpenChange = "afterOpenChange"
        >
            <a-descriptions  bordered :column="1">
                <a-descriptions-item label="用户名" >{{ drawer.info.username }}</a-descriptions-item>
                <a-descriptions-item label="uid" >{{ drawer.info.uid }}</a-descriptions-item>
                <a-descriptions-item label="url" >{{ drawer.info.url }}</a-descriptions-item>
                <a-descriptions-item label="请求方式" >{{ drawer.info.method }}</a-descriptions-item>
                <a-descriptions-item label="请求数据" >{{ drawer.info.request_data }}</a-descriptions-item>
                <a-descriptions-item label="ip" >{{ drawer.info.ip }}</a-descriptions-item>
                <a-descriptions-item label="请求时间" >{{ timestampToTime(drawer.info.created_at) }}</a-descriptions-item>
            </a-descriptions>
        </a-drawer>
    </div>
</template>

<script setup>
    import {reactive,defineEmits} from "vue"
    import {timestampToTime}  from "@/helper/time";

    let props =  defineProps(['record','open'])

    const emit = defineEmits(['drawe_close']);
   
    function drawerClose(){
        emit('drawe_close', false);
    }

    let initInfo = {
        uid:'',
        url: '',
        method:'',
        request_data:'',
        ip:'',
        created_at:'',
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