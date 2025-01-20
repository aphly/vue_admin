<template>
    <div class="adminMain">
        <RouterTitle></RouterTitle>

        <div class="mainContext">
            
        </div>

    </div>
</template>

<script setup>
    import {onMounted, reactive,computed} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    
    import RouterTitle from '@/components/admin/RouterTitle.vue';

    let common = reactive({
        levelTreeData:[],
        typeData:[],
    })

    onMounted(async()=>{
        let res = await request.get("/admin/system/op/server/index")
        if (!res.code){
            //console.log(res.data)
        }
    })

   
</script>

<style lang="scss" scoped>

</style>