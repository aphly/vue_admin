<template>
    <div class="adminMain">
        <RouterTitle></RouterTitle>
        <div class="mainTop">
            <div class="searchBox">
                <a-input v-model:value="table.search.ip" placeholder="IP"/>
                <a-button type="primary"  @click="searchData">搜索</a-button>
            </div>
        </div>

        <div class="mainContext">
            <div class="listBox">
                <a-table :dataSource="table.data" :columns="table.columns" :rowSelection="{selectedRowKeys: del.selectedRowKeys,onChange: onSelectChange
                    }" :pagination="false" size="small">
                    <template #bodyCell="{ column, record }">
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
</template>

<script setup>
    import {onMounted, reactive,computed} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    import RouterTitle from '@/components/admin/RouterTitle.vue';
    import {timestampToTime}  from "@/helper/time";

    let table = reactive({
        search:{
            ip:'',
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
                title: 'IP',
                dataIndex: 'ip',
            },
            {
                title: '参数',
                dataIndex: 'input',
            },
            {
                title: '时间',
                dataIndex: 'created_at_format',
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
        let res = await request.get("/admin/system/op/login_log/index",{ params })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        if(res.data.list){
            table.data = res.data.list.map(obj => {
                return { ...obj, key: obj.id,created_at_format:timestampToTime(obj.created_at)};
            });
        }else{
            table.data = []
        }
        table.count = res.data.count
    }

    async function delRecord(){
        let res = await request.post("/admin/system/op/login_log/del",{ids:del.selectedRowKeys })
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