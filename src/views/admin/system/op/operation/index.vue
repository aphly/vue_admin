<template>
    <div class="adminMain">
        <RouterTitle></RouterTitle>
        <div class="mainTop">
            <div class="searchBox">
                <a-input v-model:value="table.search.uid" placeholder="uid"/>
                <a-input v-model:value="table.search.url" placeholder="url"/>
                <a-button type="primary"  @click="searchData">搜索</a-button>
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
</template>

<script setup>
    import {onMounted, reactive,computed} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    import DrawerInfo from '@/views/admin/system/op/operation/info.vue';
    import RouterTitle from '@/components/admin/RouterTitle.vue';
    import {timestampToTime}  from "@/helper/time";

    let table = reactive({
        search:{
            uid:'',
            url:'',
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
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: 'URL',
                dataIndex: 'url',
            },
            {
                title: '请求方法',
                dataIndex: 'method',
            },
            {
                title: 'IP',
                dataIndex: 'ip',
            },
            {
                title: '请求时间',
                dataIndex: 'created_at_format',
            },
            {
                title: '操作',
                key: 'action',
            }
        ]
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
        let res = await request.get("/admin/system/op/operation/index",{ params })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        if(res.data.list){
            table.data = res.data.list.map(obj => {
                return { ...obj, key: obj.id,username:obj.Manager.username,created_at_format:timestampToTime(obj.created_at)};
            });
        }else{
            table.data = []
        }
        
        table.count = res.data.count
    }

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

    async function delRecord(){
        let res = await request.post("/admin/system/op/operation/del",{ids:del.selectedRowKeys })
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