<template>
    <div class="adminMain">
        <RouterTitle></RouterTitle>
        <div class="mainTop">
            <div class="searchBox">
                <a-input v-model:value="table.search.uid" placeholder="uid"/>
                <a-button type="primary"  @click="searchData">搜索</a-button>
            </div>
            <div class="btnBox">
                <a-button type="primary" @click="onAdd">
                    新增
                </a-button>
            </div>
        </div>

        <div class="mainContext">
            <div class="listBox">
                <a-table :dataSource="table.data" :columns="table.columns" :rowSelection="{selectedRowKeys: del.selectedRowKeys,onChange: onSelectChange
                    }" :pagination="false" size="small">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                        <span>
                            <a @click="onInfo(record)">详情</a>
                            <a-divider type="vertical" />
                        </span>
                        </template>
                        <template v-if="column.key === 'created_at_format'">
                        <span>
                            {{ record.created_at_format }}
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
    <DrawerInfo :record="drawerInfo.record" :open="drawerInfo.open" @drawe_close="draweClose"></DrawerInfo>
    <DrawerAdd :open="drawerAdd.open" @drawe_add_close="draweAddClose"></DrawerAdd>
</template>

<script setup>
    import {onMounted, reactive,computed} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    
    import RouterTitle from '@/components/admin/RouterTitle.vue';

    import DrawerInfo from '@/views/admin/system/op/upload/info.vue';
    import DrawerAdd from '@/views/admin/system/op/upload/add.vue';
    import  {allToSelect}  from '@/helper/tree.js';
    import  {arrToKeyObj}  from '@/helper/arr.js';

    let table = reactive({
        search:{
            uid:'',
        },
        count :0,
        page : 1,
        data :[],
        columns:[
            {
                title: 'ID',
                dataIndex: 'id',
            },
            {
                title: '用户',
                dataIndex: 'manager_username',
            },
            {
                title: '路径',
                dataIndex: 'path',
            },
            {
                title: '层级',
                dataIndex: 'level_title',
            },
            {
                title: '操作',
                key: 'action',
            }
        ]
    })

    let common = reactive({
        levelTreeData:[],
    })

    let drawerInfo = reactive({
        record:{},
        open:false,
    })

    function onInfo(record){
        drawerInfo.record = {...record}
        drawerInfo.open=true;
    }

    function draweClose(b){
        drawerInfo.record = {}
        drawerInfo.open=b
        getList()
    }

    let drawerAdd = reactive({
        open:false,
    })

    function onAdd(){
        drawerAdd.open=true;
    }

    function draweAddClose(b){
        drawerAdd.open=b
        getList()
    }

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
        let res = await request.get("/admin/system/op/upload/index",{ params })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        if(res.data.list){
            table.data = res.data.list.map(obj => {
                return { ...obj, key: obj.id,level_title:obj.Level.title, manager_username:obj.Manager.username};
            });
        }else{
            table.data = []
        }
        table.count = res.data.count
    }

    async function delRecord(){
        let res = await request.post("/admin/system/op/upload/del",{ids:del.selectedRowKeys })
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

    onMounted(async()=>{
        
        let res = await request.get("/admin/system/perm/level/all")
        if (!res.code){
            common.levelTreeData = allToSelect(res.data.list)
        }

        getList()
    })

   
</script>

<style lang="scss" scoped>

</style>