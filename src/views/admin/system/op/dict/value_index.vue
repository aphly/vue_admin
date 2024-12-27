<template>
    <div class="w900">
        <a-drawer :title="props.record.title"
            :open="props.open"
            @close="drawerValueClose"
            @afterOpenChange = "afterOpenChange">
            <div class="">
                <div class="btnBox" style="margin-bottom: 20px;">
                    <a-button type="primary" @click="onAdd">
                        新增
                    </a-button>
                </div>
                
                <div class="listBox">
                    <a-table :dataSource="table.data" :columns="table.columns" :rowSelection="{selectedRowKeys: del.selectedRowKeys,onChange: onSelectChange
                        }" :pagination="false" size="small">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'action'">
                            <span>
                                <a @click="onEdit(record)">编辑</a>
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
        </a-drawer>
    </div>
    <DrawerValueForm :record="drawerValueForm.record" :open="drawerValueForm.open" @drawe_value_form_close="drawerValueFormClose"></DrawerValueForm>
</template>

<script setup>
    import {reactive,computed} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    
    import DrawerValueForm from '@/views/admin/system/op/dict/value_form.vue';

    let props =  defineProps(['record','open'])

    const emit = defineEmits(['drawe_value_close']);
   
    function drawerValueClose(){
        emit('drawe_value_close', false);
    }

    let table = reactive({
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
                title: '值',
                dataIndex: 'value',
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
    
    async function getList(){
        if(props.record.id){
            let params = {page:table.page,dict_id:props.record.id}
            let res = await request.get("/admin/system/op/dict/value_index",{ params })
            if (res.code){
                return message.info(
                    res.msg
                );
            }
            if(res.data.list){
                table.data = res.data.list.map(obj => {
                    return { ...obj, key: obj.id};
                });
            }else{
                table.data =  [] 
            }
            
            table.count = res.data.count
        }
    }

    let drawerValueForm = reactive({
        record:{},
        open:false,
    })

    function onAdd(){
        drawerValueForm.record['dict_id'] = props.record.id
        drawerValueForm.open=true
    }

    function onEdit(record){
        drawerValueForm.record = {...record}
        drawerValueForm.open=true;
    }

    function drawerValueFormClose(b){
        drawerValueForm.record = {}
        drawerValueForm.open=b
        getList()
    }

    async function delRecord(){
        let res = await request.post("/admin/system/op/dict/value_del",{ids:del.selectedRowKeys })
        if (res.code){
            return message.info(
                res.msg
            );
        }else{
            getList()
        }
    }

    function afterOpenChange(b){
        if(props.record.id){
            getList()
        }else{
            table.data=[]
        }
    }

</script>

<style lang="scss" scoped>

</style>