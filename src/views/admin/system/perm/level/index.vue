<template>
    <div class="adminMain">
        <RouterTitle></RouterTitle>
        <div class="mainContext">
            <div class="treeBox">
                <a-tree :tree-data="treeData" v-model:selectedKeys="selectedKeys">
                </a-tree>
            </div>
            <div class="listBox">
                <div class="treeBtn">
                    <a-button type="primary" @click="rebuildBtn" style="margin-right: 20px;">
                        重建路径
                    </a-button>
                    <a-button type="primary" @click="addBtn" v-show="tree.btn.add" style="margin-right: 20px;">
                        新增
                    </a-button>
                    <a-button type="primary" @click="editBtn" v-show="tree.btn.edit" style="margin-right: auto;">
                        编辑
                    </a-button>
                    <a-button class="delBtn"  @click="delBtn" v-show="tree.btn.del">
                        删除
                    </a-button>
                </div>
                <div v-show="tree.btn.form" class="box">
                    <a-form :model="tree.form" :rules="tree.rules" layout="vertical" ref="formRef" >
                        <div v-if="tree.form.id">
                            <a-form-item label="Id">
                                <a-input :disabled="true" v-model:value="tree.form.id" />
                            </a-form-item>
                        </div>
                        <a-form-item label="名称">
                            <a-input v-model:value="tree.form.title" placeholder="名称" />
                        </a-form-item>
                        <a-form-item label="Pid" v-show="false">
                            <a-input-number :disabled="true" v-model:value="tree.form.pid"/>
                        </a-form-item>
                        <a-form-item label="排序">
                            <a-input-number v-model:value="tree.form.sort" :min="0" :max="10000" />
                        </a-form-item>
                        <a-form-item label="状态">
                            <a-switch v-model:checked="tree.form.status" />
                        </a-form-item>
                    </a-form>
                    <a-button type="primary" @click="saveForm">
                        保存
                    </a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch,onBeforeMount, reactive } from 'vue';
    import  {allToTree,itemHasChild}  from '@/helper/tree.js';
    import  request  from '@/helper/request.js';
    import { message } from 'ant-design-vue';
    import RouterTitle from '@/components/admin/RouterTitle.vue';

    const formRef = ref(null);
    let treeData = ref([])
    
    const selectedKeys = ref([]);
    let initForm = {
            id:0,
            title: '',
            pid:0,
            sort:0,
            status:true,
        }

    let tree = reactive({
        form:{...initForm},
        rules:{
        },
        btn:{
            add:true,
            edit:false,
            del:false,
            form:false,
        },
        form_type:'add',
        select_id:0,
        record:{}
    })

    let list = [];

    watch(selectedKeys, () => {
        let select_id = selectedKeys.value[0]
        tree.select_id = select_id?select_id:0
        formRef.value.resetFields()
        tree.btn.form=false
        
        if(tree.select_id){
            tree.record = list.filter(item=>{
                return item.id==tree.select_id;
            })[0]
            tree.btn.add=true
            if(itemHasChild(list,tree.select_id)){
                tree.btn.del=false
            }else{
                tree.btn.del=true
            }
            tree.btn.edit=true
        }else{
            tree.btn.add=true
            tree.btn.edit=false
            tree.btn.del=false
        }
        
    });

    onBeforeMount(()=>{
        updateTree()
    })

    function initPage(){
        formRef.value.resetFields()
        tree.btn.form=false
        tree.form = {...initForm}
        tree.select_id = 0
        tree.record ={}
        tree.btn = {
            add:true,
            edit:false,
            del:false,
            form:false,
        }
        selectedKeys.value = []
        updateTree()
    }

    async function addBtn(){
        formRef.value.resetFields()
        tree.btn.form=true
        tree.btn.form_type='add'
        tree.form = {...initForm}
        tree.form.pid = parseInt(tree.select_id)
    }

    async function editBtn(){
        formRef.value.resetFields()
        tree.btn.form=true
        tree.btn.form_type='edit'
        tree.form = {...tree.record,status:tree.record.status?true:false}
    }

    async function delBtn(){
        if(tree.record.id){
            let res = await request.post("/admin/system/perm/level/del",{ids:[tree.record.id]})
            if(!res.code){
                message.success(
                    res.msg
                );
                initPage()
            }else{
                message.info(
                    res.msg
                );
            }
        }
    }
    
    async function saveForm(){
        let saveData = {...tree.form,status:tree.form.status?1:0}
        if(tree.btn.form_type=='add'){
            let res = await request.post("/admin/system/perm/level/add",saveData)
            if(!res.code){
                message.success(
                    res.msg
                );
                initPage()
            }else{
                message.info(
                    res.msg
                );
            }
        }else{
            let res = await request.post("/admin/system/perm/level/edit",saveData)
            if(!res.code){
                message.success(
                    res.msg
                );
                initPage()
            }else{
                message.info(
                    res.msg
                );
            }
        }
    }

    async function updateTree(){
        let res = await request.get("/admin/system/perm/level/all")
        if(!res.code){
            list = res.data.list
            treeData.value = allToTree(list)
            //console.log(treeData,list)
        }else{
            return message.info(res.msg)
        }
    }

    async function rebuildBtn(){
        let res = await request.post("/admin/system/perm/level/rebuild")
        if(!res.code){
            message.success(
                res.msg
            );
        }else{
            message.info(
                res.msg
            );
        }
    }
    
</script>

<style lang="scss" scoped>
.list_tree {
  
  :deep(.tree_type_1) {
    color: #000000;
  }
  :deep(.tree_type_2) {
    color: #086aa3;
  }
  :deep(.tree_type_3) {
    color: #999b0a;
  }
}
</style>