<template>
    <div class="adminMain">
        <RouterTitle></RouterTitle>
        <div class="mainTop">
            <div class="searchBox">
                <a-input v-model:value="table.search.uid" placeholder="uid"/>
                <a-input v-model:value="table.search.username" placeholder="username"/>
                <a-input v-model:value="table.search.phone" placeholder="手机号码"/>
                <a-select v-model:value="table.search.status" >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="1">开启</a-select-option>
                    <a-select-option value="0">关闭</a-select-option>
                </a-select>
                <a-button type="primary"  @click="searchData">搜索</a-button>
            </div>
            <div class="btnBox">
                <a-button type="primary" @click="drawerForm.open=true">
                    新增
                </a-button>
            </div>
        </div>

        <div class="mainContext">
            <div class="listBox">
                <a-table :dataSource="table.data" :columns="table.columns" :rowSelection="{selectedRowKeys: del.selectedRowKeys,onChange: onSelectChange
                    }" :pagination="false" size="small">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'status'">
                            <a-tag v-if="record.status==1" color="green">开启</a-tag>
                            <a-tag v-else color="red">关闭</a-tag>
                        </template>
                        <template v-else-if="column.key === 'action'">
                        <span>
                            <a @click="onEdit(record)">编辑</a>
                            <a-divider type="vertical" />
                            <a @click="onRole(record)">角色</a>
                        </span>
                        </template>
                    </template>
                </a-table>
                <div class="adminPagination" >
                    <a-button type="primary" size="small" :disabled="!hasSelected" :loading="del.loading" @click="delRecord">
                        删除
                    </a-button>
                    <a-pagination v-model:current="table.page" :total="table.count" show-less-items size="small" @change="getList"/>
                </div>
            </div>
        </div>
    </div>
    <DrawerForm :record="drawerForm.record" :open="drawerForm.open" @drawe_close="draweClose"></DrawerForm>
    <DrawerRole :manager_role="drawerRole.manager_role" :manager_uid="drawerRole.manager_uid"  :open="drawerRole.open" :username="drawerRole.username" @drawe_role_close="draweRoleClose"></DrawerRole>
</template>

<script setup>
    import {onMounted, reactive,computed} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    import DrawerForm from '@/views/admin/system/perm/manager/form.vue';
    import DrawerRole from '@/views/admin/system/perm/manager/role.vue';
    import RouterTitle from '@/components/admin/RouterTitle.vue';

    let table = reactive({
        search:{
            uid:'',
            username:'',
            status:'',
            phone:""
        },
        count :0,
        page : 1,
        data :[],
        columns:[
            {
                title: 'UID',
                dataIndex: 'uid',
            },
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '昵称',
                dataIndex: 'nickname',
            },
            {
                title: '状态',
                key: 'status',
            },
            {
                title: '操作',
                key: 'action',
            }
        ],
    })

    let del = reactive({
        selectedRowKeys: [],
        loading: false,
    }) 

    const hasSelected = computed(() => del.selectedRowKeys.length > 0);
    const onSelectChange = selectedRowKeys => {
        del.selectedRowKeys = selectedRowKeys;
    };
    
    async function getList(search={}){
        let params = {page:table.page,...search}
        let res = await request.get("/admin/system/perm/manager/index",{ params })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        let newArray = res.data.list.map(obj => {
            return { ...obj, key: obj.id };
        });
        table.data = newArray
        table.count = res.data.count
    }

    let drawerForm = reactive({
        record:{},
        open:false,
    })

    function onEdit(record){
        drawerForm.record = {...record,status:record.status?true:false}
        drawerForm.open=true;
    }

    function draweClose(b){
        drawerForm.record = {}
        drawerForm.open=b
        getList()
    }

    let drawerRole = reactive({
        manager_role:[],
        manager_uid:0,
        open:false,
    })

    async function onRole(record){
        let res = await request.get("/admin/system/perm/manager/role",{params:{manager_uid:record.uid} })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        drawerRole.manager_role = res.data.manager_role
        drawerRole.manager_uid = record.uid
        drawerRole.open=true;
        drawerRole.username=record.username;
    }

    function draweRoleClose(b){
        drawerRole.record = {}
        drawerRole.open=b
    }

    async function delRecord(){
        let params = {ids:del.selectedRowKeys }
        let res = await request.get("/admin/system/perm/manager/del",{params })
        if (res.code){
            return message.info(
                res.msg
            );
        }else{
            getList()
        }
    }

    function searchData(){
        getList(table.search)
    }

    onMounted(()=>{
        getList()
    })
   
</script>

<style lang="scss" scoped>

</style>