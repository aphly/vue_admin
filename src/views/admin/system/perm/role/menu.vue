<template>
    <div>
        <a-drawer
            :title="props.title+' 菜单'"
            :open="props.open"
            @close="drawerMenuClose"
            @afterOpenChange = "afterOpenChange"
        >
            <div style="" class="list_tree">
                <a-tree
                    :tree-data="drawer.treeData"
                    checkable
                    :selectable="false"
                    v-model:checkedKeys="drawer.checkedKeys"
                    @check="onCheck"
                    v-model:expandedKeys="drawer.expandedKeys"
                >
                </a-tree>
            </div>
            <template #extra>
            <a-space>
                <a-button type="primary" @click="save">保存</a-button>
            </a-space>
            </template>
        </a-drawer>
    </div>
</template>

<script setup>
    import {reactive,defineEmits ,onBeforeMount, nextTick} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    import  {allToTree}  from '@/helper/tree.js';

    let props =  defineProps(['role_menu','role_id','open','title'])

    const emit = defineEmits(['drawe_menu_close']);
   
    function drawerMenuClose(){
        emit('drawe_menu_close', false);
    }

    const drawer = reactive({
        open:false,
        treeData:[],
        checkedKeys:[],
        halfcheckKeys:[],
        expandedKeys:[]
    });
    
    const save = async() => {
        let checkedKeys = drawer.checkedKeys.map((item)=>{
            return parseInt(item)
        })
        let halfcheckKeys = drawer.halfcheckKeys.map((item)=>{
            return parseInt(item)
        })
        let saveData = {checked_keys:checkedKeys,halfcheck_keys:halfcheckKeys}
        //console.log(saveData)
        let res = await request.post("/admin/system/perm/role/menu?role_id="+props.role_id,saveData)
        if (res.code){
            return message.info(
                res.msg
            );
        }else{
            drawerMenuClose()
        }
    };

    function onCheck(keys, e) {
        drawer.halfcheckKeys = e.halfCheckedKeys
    }

    function afterOpenChange(b){
        if(props.role_menu.length>0){
            let ids = [...new Set(props.role_menu.map(item => String(item.menu_id)))];
            drawer.checkedKeys = ids
        }
        if(!b){
            drawer.checkedKeys=[]
            drawer.halfcheckKeys=[]
        }
    }

    onBeforeMount(async()=>{
        let res = await request.get("/admin/system/perm/menu/all?status=1")
        if (!res.code){
            drawer.treeData = allToTree(res.data.list)
            drawer.expandedKeys = drawer.treeData.map((item)=>{
                return item.key
            })
        }
    })
    
</script>

<style lang="scss" scoped>

</style>