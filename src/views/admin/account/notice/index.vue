<template>
<div class="adminMain">
    <div >
        <div class="adminMainTitle">
            <div style="display: flex;align-items: center;">
                <div @click="info.open=false" style="cursor: pointer;">消息</div>
                <div v-show="info.open" style="color: #999;font-size: 12px;">
                    <i  class="vue_icon admin-qianjin1" style="margin: 0 10px;font-size: 12px;"></i>
                     {{ info.title }} </div>
            </div>
        </div>
        <div v-show="!info.open" class="adminList">
            <a-list item-layout="horizontal"  :data-source="list.data" style="width: 100%;">
            <template #renderItem="{ item }">
                <a-list-item  @click="info_open(item) ">
                    <div class="adminLi">
                        <a-tag :color="item.dict_value">{{ item.dict_value_title }}</a-tag>
                        <div style="margin-right: auto;">{{ item.title }}</div>
                        <div class="adminTime">{{ timestampToTime(item.updated_at) }}</div>
                    </div>
                </a-list-item>
            </template>
            </a-list>
        </div>
        <Info v-show="info.open" :record="info.record"  @info_close="info_close"></Info>
    </div>
</div>

</template>

<script setup>

    import {onMounted, reactive} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    import Info from '@/views/admin/account/notice/info.vue';
    import  {arrToKeyObj}  from '@/helper/arr.js';
    import  {timestampToTime}  from '@/helper/time.js';

    let list = reactive({
        count :0,
        page : 1,
        data :[],
    })

    let info = reactive({
        open:false,
        record:{},
        title:'',
    })

    function info_close(b){
        info.open=false
    }

    function info_open(record){
        info.open=true
        info.record = record
        info.title = record.title
    }

    let common = reactive({
        dictValueData:[],
    })

    async function getList(search={}){
        let params = {page:list.page,...search}
        let res = await request.get("/admin/account/notice/index",{ params })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        if(res.data.list){
            list.data = res.data.list.map(obj => {
                return { ...obj, key: obj.id , dict_value_title:common.dictValueData[obj.dict_value].title};
            });
        }else{
            list.data = []
        }
        list.count = res.data.count
    }

    onMounted(async()=>{
        let res1 = await request.get("/admin/dict/info?id=1")
        if (!res1.code){
            common.dictValueData = arrToKeyObj(res1.data.info.DictValue,'value')
        }

        getList()
        
    })
    
</script>

<style lang="scss">

</style>