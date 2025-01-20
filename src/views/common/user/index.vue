<template>
    <div class="adminMain">
        <RouterTitle></RouterTitle>
        <div class="mainTop">
            <div class="searchBox">
                <a-input v-model:value="table.search.uid" placeholder="uid"/>
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
                            <a @click="onAvatar(record)">头像</a>
                        </span>
                        </template>
                        <template v-if="column.key === 'created_at_format'">
                        <span>
                            {{ record.created_at_format }}
                        </span>
                        </template>
                        <template v-if="column.key === 'status'">
                            <a-switch v-model:checked="record.statusB" size="small" @click="StatusRecord(record)" />
                        </template>
                    </template>
                    <template #expandedRowRender="{ record }">
                    <ul style="margin: 0">
                        <li v-for="v,k in record.UserAuth" :key="k" style="display: flex;">
                            <div><span>{{ v.id_type }} : </span><span>{{ v.id }}</span></div>
                        </li>
                    </ul>
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
    <DrawerAvatar :record="drawerAvatar.record" :open="drawerAvatar.open" @drawe_avatar_close="draweAvatarClose"></DrawerAvatar>
</template>

<script setup>
    import {onMounted, reactive,computed} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    
    import RouterTitle from '@/components/admin/RouterTitle.vue';
    import DrawerForm from '@/views/common/user/form.vue';
    import DrawerAvatar from '@/views/common/user/avatar.vue';
    let table = reactive({
        search:{
            uid:'',
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
        let res = await request.get("/common/user/index",{ params })
        if (res.code){
            return message.info(
                res.msg
            );
        }
        if(res.data.list){
            table.data = res.data.list.map(obj => {
                return { ...obj, key: obj.uid,statusB: obj.status===1?true:false};
            });
        }else{
            table.data = []
        }
        table.count = res.data.count
    }

    let drawerAvatar = reactive({
        record:{},
        open:false,
    })

    function onAvatar(record){
        drawerAvatar.record = {...record}
        drawerAvatar.open=true;
    }

    function draweAvatarClose(b){
        drawerAvatar.record = {}
        drawerAvatar.open=b
        getList()
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
        let res = await request.post("/common/user/del",{ids:del.selectedRowKeys })
        if (res.code){
            return message.info(
                res.msg
            );
        }else{
            getList()
        }
    }

    async function StatusRecord(record){
        let res = await request.post("/common/user/status",{uid:record.uid,status:record.status?0:1 })
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
        
        getList()
    })

   
</script>

<style lang="scss" scoped>

</style>