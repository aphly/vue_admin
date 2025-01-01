<template>
    <div>
        <a-drawer
            :title="props.username+' 角色'"
            :open="props.open"
            @close="drawerRoleClose"
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
    import {reactive,defineEmits ,onBeforeMount} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    import  {roleToTree}  from '@/helper/tree.js';

    let props =  defineProps(['manager_role','manager_uid','open','username'])

    const emit = defineEmits(['drawe_role_close']);
   
    function drawerRoleClose(){
        emit('drawe_role_close', false);
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
        let res = await request.post("/admin/system/perm/manager/role?manager_uid="+props.manager_uid,saveData)
        if (res.code){
            return message.info(
                res.msg
            );
        }else{
            drawerRoleClose()
        }
    };

    function onCheck(keys, e) {
        drawer.halfcheckKeys = e.halfCheckedKeys
    }

    function afterOpenChange(b){
        if(props.manager_role.length>0){
            let ids = [...new Set(props.manager_role.map(item => String(item.role_id)))];
            drawer.checkedKeys = ids
        }
        if(!b){
            drawer.checkedKeys=[]
            drawer.halfcheckKeys=[]
        }
    }

    onBeforeMount(async()=>{
        let res = await request.get("/admin/system/perm/role/all")
        if (!res.code){
            drawer.treeData = roleToTree(res.data.list)
            drawer.expandedKeys = drawer.treeData.map((item)=>{
                return item.key
            })
        }else{
            return message.info(res.msg)
        }
    })
    
</script>

<style lang="scss" scoped>
.list_tree {
   :deep(.ant-tree-list-holder-inner)   {
    display: inline-block !important;
  }
  :deep(.tree_leaf) {
    display: inline-flex !important;
    margin-right: 20px;
  }
}
</style>