<template>
<a-layout-header style="  width: 100%;background-color: #fff; }">
<div class="logo" />
<a-menu
    v-model:selectedKeys="selectedKeys"
    mode="horizontal"
    :style="{ lineHeight: '64px' }"
    :items="roleMenu"
    @click = "titleClick"
>
</a-menu>
</a-layout-header>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useRouter} from 'vue-router';
const router = useRouter();
import  {frontListToMenu,OpenKeysSelectedKeysByTree}  from '@/helper/tree.js';
import Axios  from "@/helper/axios";
const roleMenu = ref([
    {
        key: 'home',
        label: '首页',
        title: '首页',
    },
]);

const selectedKeys = ref(['2']);

function titleClick(params){
    router.push('/article/index?category_id='+params.key)
}

async function getList(){
    let res = await Axios.get("/blog/article/category")
    if (res.code){
        return message.info(
            res.msg
        );
    }
    if(res.data.list){
        let arr = frontListToMenu(res.data.list)
        arr.map(obj => {
            roleMenu.value.push(obj)
        });
    }
}
getList()
</script>