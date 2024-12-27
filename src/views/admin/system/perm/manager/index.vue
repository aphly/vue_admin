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
                            <a-switch v-model:checked="record.statusB" size="small" @click="StatusRecord(record)" />
                        </template>
                        <template v-else-if="column.key === 'action'">
                        <span>
                            <a @click="onEdit(record)">编辑</a>
                            <a-divider type="vertical" />
                            <a @click="onRole(record)">角色</a>
                        </span>
                        </template>
                        <template v-else-if="column.key === 'roles'">
                            <span>
                            <a-tag v-for="tag in record.roles" :key="tag"  color="volcano">
                                {{ tag }}
                            </a-tag>
                            </span>
                        </template>
                    </template>
                </a-table>
                <div class="adminPagination" >
                    <a-popconfirm title="确认删除吗?" @confirm="delRecord" ok-text="确认" cancel-text="取消" :disabled="!hasSelected">
                        <a-button  size="small"  :disabled="!hasSelected" :loading="del.loading" >删除</a-button>
                    </a-popconfirm>
                    <a-pagination :showSizeChanger="false" v-model:current="table.page" :total="table.count" show-less-items size="small" @change="getList"/>
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
                title: '角色',
                key: 'roles',
                dataIndex: 'roles',
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
        manager_role:[]
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
        let uidRole = {}
        Object.keys(res.data.manager_role).forEach(key=>{
            uidRole[key] = []
            res.data.manager_role[key].forEach(i=>{
                uidRole[key].push(i.Role.title)
            })
        })
        //console.log(uidRole)
        if(res.data.list){
            table.data = res.data.list.map(obj => {
                return { ...obj, key: obj.uid ,statusB: obj.status===1?true:false ,roles:uidRole[obj.uid]};
            });
        }else{
            table.data = []
        }
        
        table.count = res.data.count
        table.manager_role = res.data.manager_role
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
        if(record.uid in table.manager_role){
            drawerRole.manager_role = table.manager_role[record.uid]
        }else{
            drawerRole.manager_role = []
        }
        drawerRole.manager_uid = record.uid
        drawerRole.open=true;
        drawerRole.username=record.username;
    }

    function draweRoleClose(b){
        drawerRole.record = {}
        drawerRole.open=b
        getList()
    }

    async function delRecord(){
        let res = await request.post("/admin/system/perm/manager/del",{ids:del.selectedRowKeys})
        if (res.code){
            return message.info(
                res.msg
            );
        }else{
            getList()
        }
    }

    async function StatusRecord(record){
        let res = await request.post("/admin/system/perm/manager/status",{uid:record.uid,status:record.status?0:1 })
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