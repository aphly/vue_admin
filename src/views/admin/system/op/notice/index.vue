<template>
    <div class="adminMain">
        <RouterTitle></RouterTitle>
        <div class="mainTop">
            <div class="searchBox">
                <a-input v-model:value="table.search.title" placeholder="名称"/>
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
                        <template v-if="column.key === 'action'">
                        <span>
                            <a @click="onEdit(record)">编辑</a>
                            <a-divider type="vertical" />
                        </span>
                        </template>
                        <template v-if="column.key === 'created_at_format'">
                        <span>
                            {{ record.created_at_format }}
                        </span>
                        </template>
                        <template v-if="column.key === 'dict_value_title'">
                        <span>
                            <a-tag :color="record.dict_value">{{ record.dict_value_title }}</a-tag>
                        </span>
                        </template>
                        <template v-if="column.key === 'status'">
                            <a-switch v-model:checked="record.statusB" size="small" @click="StatusRecord(record)" />
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
    <DrawerForm :record="drawerForm.record" :common="common" :open="drawerForm.open" @drawe_close="draweClose"></DrawerForm>
</template>

<script setup>
    import {onMounted, reactive,computed} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    
    import RouterTitle from '@/components/admin/RouterTitle.vue';
    import DrawerForm from '@/views/admin/system/op/notice/form.vue';
    import  {allToSelect}  from '@/helper/tree.js';
    import  {arrToKeyObj}  from '@/helper/arr.js';

    let table = reactive({
        search:{
            title:'',
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
            },
            {
                title: '类型',
                key: 'dict_value_title',
                dataIndex: 'dict_value_title',
            },
            {
                title: '层级',
                dataIndex: 'level_title',
            },
            {
                title: '状态',
                key: 'status',
            },
            {
                title: '操作',
                key: 'action',
            }
        ]
    })

    let common = reactive({
        levelTreeData:[],
        dictValueData:[],
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
        let res = await request.get("/admin/system/op/notice/index",{ params })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        if(res.data.list){
            table.data = res.data.list.map(obj => {
                return { ...obj, key: obj.id,statusB: obj.status===1?true:false, dict_value_title:common.dictValueData[obj.dict_value].title,level_title:obj.Level.title};
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
        drawerForm.record = {...record,status:record.status?true:false}
        drawerForm.open=true;
    }

    function draweClose(b){
        drawerForm.record = {}
        drawerForm.open=b
        getList()
    }

    async function delRecord(){
        let res = await request.post("/admin/system/op/notice/del",{ids:del.selectedRowKeys })
        if (res.code){
            return message.info(
                res.msg
            );
        }else{
            getList()
        }
    }

    async function StatusRecord(record){
        let res = await request.post("/admin/system/op/notice/status",{id:record.id,status:record.status?0:1 })
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

        let res1 = await request.get("/admin/dict/info?id=1")
        if (!res1.code){
            common.dictValueData = arrToKeyObj(res1.data.info.DictValue,'value')
            //console.log(common.dictValueData)
        }
        
        getList()
    })

   
</script>

<style lang="scss" scoped>

</style>