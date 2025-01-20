<template>
    <div class="adminMain">
        <RouterTitle></RouterTitle>
        <div class="mainTop" >
            <div class="searchBox">
                <a-input v-model:value="table.search.title"  placeholder="名称"/>
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
            <div class="treeBox">
                <a-tree :tree-data="levelTreeData"   @select="onSelectLevel" ></a-tree>
            </div>
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
                            <a @click="onMenu(record)">菜单</a>
                            <a-divider type="vertical" />
                            <a @click="onApi(record)">接口</a>
                        </span>
                        </template>
                    </template>
                </a-table>
                <div class="adminPagination" style="display: flex;justify-content: space-between;">
                    <a-popconfirm title="确认删除吗?" @confirm="delRecord" ok-text="确认" cancel-text="取消" :disabled="!hasSelected">
                        <a-button  size="small"  :disabled="!hasSelected" :loading="del.loading" >删除</a-button>
                    </a-popconfirm>
                    <a-pagination :showSizeChanger="false" v-model:current="table.page" :total="table.count" show-less-items size="small" @change="getList"/>
                </div>
                
            </div>
        </div>
    </div>
    <DrawerForm :record="drawerForm.record" :levelTreeData="levelTreeData" :open="drawerForm.open" @drawe_close="draweClose"></DrawerForm>
    <DrawerMenu :role_menu="drawerMenu.role_menu" :role_id="drawerMenu.role_id"  :open="drawerMenu.open" :title="drawerMenu.title" @drawe_menu_close="draweMenuClose"></DrawerMenu>
    <DrawerApi :role_api="drawerApi.role_api" :role_id="drawerApi.role_id"  :open="drawerApi.open" :title="drawerApi.title" @drawe_api_close="drawerApiClose"></DrawerApi>
</template>

<script setup>
    import {onMounted,reactive,computed,onBeforeMount} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    import  {allToSelect}  from '@/helper/tree.js';
    import DrawerForm from '@/views/admin/system/perm/role/form.vue';
    import DrawerMenu from '@/views/admin/system/perm/role/menu.vue';
    import DrawerApi from '@/views/admin/system/perm/role/api.vue';
    import RouterTitle from '@/components/admin/RouterTitle.vue';

    let levelTreeData = []
   
    let table = reactive({
        search:{
            status:'',
            title:"",
            level_id:''
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
                title: '名称',
                dataIndex: 'title',
                ellipsis: true,
            },
            {
                title: '状态',
                key: 'status',
                ellipsis: true,
            },
            {
                title: '操作',
                key: 'action',
                ellipsis: true,
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
        let res = await request.get("/admin/system/perm/role/index",{ params })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        if(res.data.list){
            table.data = res.data.list.map(obj => {
                return { ...obj, key: obj.id,level_title: obj.Level.title };
            });
        }else{
            table.data = []
        }
        table.count = res.data.count
    }

    let drawerForm = reactive({
        record:{},
        open:false,
    })

    function onEdit(record){
        drawerForm.record = {...record,status:record.status?true:false,data_perm:String(record.data_perm),level_id:String(record.level_id)}
        drawerForm.open=true;
    }

    function draweClose(b){
        drawerForm.record = {}
        drawerForm.open=b
        getList()
    }

    let drawerMenu = reactive({
        role_menu:[],
        role_id:0,
        open:false,
    })

    async function onMenu(record){
        let res = await request.get("/admin/system/perm/role/menu",{params:{role_id:record.id} })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        drawerMenu.role_menu = res.data.role_menu
        drawerMenu.role_id = record.id
        drawerMenu.open=true;
        drawerMenu.title=record.title;
    }

    function draweMenuClose(b){
        drawerMenu.record = {}
        drawerMenu.open=b
    }

    let drawerApi = reactive({
        role_api:[],
        role_id:0,
        open:false,
    })

    async function onApi(record){
        let res = await request.get("/admin/system/perm/role/api",{params:{role_id:record.id} })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        drawerApi.role_api = res.data.role_api
        drawerApi.role_id = record.id
        drawerApi.open=true;
        drawerApi.title=record.title;
    }

    function drawerApiClose(b){
        drawerApi.record = {}
        drawerApi.open=b
    }

    async function delRecord(){
        let res = await request.post("/admin/system/perm/role/del",{ids:del.selectedRowKeys })
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
    
    onBeforeMount(async()=>{
        let res = await request.get("/admin/system/perm/level/all")
        if (!res.code){
            levelTreeData = allToSelect(res.data.list)
            //console.log(levelTreeData)
        }
    })

    onMounted(async ()=>{
        getList()
        
    })

    function onSelectLevel(keys){
        if(keys.length>0){
            table.search.level_id = parseInt(keys[0])
        }else{
            table.search.level_id = ''
        }
        getList(table.search)
    }
</script>

<style lang="scss" scoped>

</style>