<template>
<div class="adminMain">
    <div >
        <div style="text-align: right;" >
            <i class="vue_icon admin-guanbi" style="cursor: pointer;padding: 0 10px;" @click="info_close"></i>
        </div>
        <div class="" style="text-align: center;font-size: 18px;margin-bottom: 10px;">{{ props.record.title }}</div>
        <div class="" style="display: flex;justify-content: center;color: #999;margin-bottom: 10px;">
            <div>{{ timestampToTime(props.record.updated_at) }}</div>
        </div>
        <div>{{ props.record.content }}</div>

        
    </div>
</div>
</template>
<script setup>
    import  {timestampToTime}  from '@/helper/time.js';
    
    let props =  defineProps(['record'])
    const emit = defineEmits(['info_close']);
    function info_close(){
        emit('info_close', false);
    }

</script>


<style lang="scss">

</style>