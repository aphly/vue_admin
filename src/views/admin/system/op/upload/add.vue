<template>
    <div>
        <a-drawer
            title="新增"
            :open="props.open"
            @close="drawerAddClose"
            @afterOpenChange = "afterOpenChange"
        >
            <a-upload
                v-model:file-list="upload.fileList"
                :multiple="true"
                :customRequest="customRequest"
                @remove="removeFile"
            >
                <a-button>
                上传
                </a-button>
            </a-upload>
            <a-upload
                v-model:file-list="upload.fileListOss"
                :multiple="true"
                :customRequest="customRequestOss"
                @remove="removeFileOss"
            >
                <a-button>
                oss
                </a-button>
            </a-upload>
        </a-drawer>
    </div>
</template>

<script setup>
    import {reactive,defineEmits,ref} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    import {config} from '@/config/index.js';
    import {base64ToBlob,ext} from '@/helper/file.js';
    import {random_string} from '@/helper/func.js';

    import { useManagerStore } from '@/stores/manager'
    const manager = useManagerStore()

    let props =  defineProps(['open'])

    const emit = defineEmits(['drawe_add_close']);
   
    function drawerAddClose(){
        emit('drawe_add_close', false);
    }

    let upload = reactive({
        fileList:[],
        fileListOss:[],
    })

    const customRequest = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        console.log(file)
        const formData = new FormData();
        formData.append('file', file);
        let res = await request.post(config.ApiHOST+'/admin/system/op/upload/add',formData)
        if(!res.code){
            // upload.fileList.push({uid: file.uid, name: file.name, url: res.data.url,status: 'done' })
            console.log(upload.fileList)
            onSuccess("uploadd success");
            let resFileList = [...upload.fileList];
            resFileList = resFileList.map(file => {
                console.log(file)
                if (file.uid==file.uid) {
                    file.url = res.data.url;
                    file.upload_id = res.data.id;
                }
                return file;
            });
            upload.fileList = resFileList
            console.log(upload.fileList)
        }else{
            onError("upload error");
            message.info(res.msg)
        }
    }

    const customRequestOss = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        let res = await request.get(config.ApiHOST+'/v1/oss/token')
        if(!res.code){
            const { host, dir, accessid, signature, policy,callback } = res.data.oss_token;
            const formData = new FormData();
            formData.append('key', dir + random_string() + ext(file.name));
            formData.append('policy', policy);
            formData.append('OSSAccessKeyId', accessid);
            formData.append('success_action_status', '200');
            formData.append('callback',callback);
            formData.append('Signature', signature);
            formData.append('file', file);
            let ossRes = await axios.post(host,formData)
            console.log(ossRes)
        }else{
            onError("upload error");
            message.info(res.msg)
        }
    }

    const removeFileOss = async (file) => {
        let id = 0
        upload.fileList.forEach((item)=>{
            if(item.uid==file.uid){
                id=item.upload_id
            }
        })
        if(id){
            let res = await request.post(config.ApiHOST+'/admin/system/op/upload/del',{ids:[id]})
            console.log(res)
            if(!res.code){
            }
            message.info(res.msg)
        }
    };

    const removeFile = async (file) => {
        let id = 0
        upload.fileList.forEach((item)=>{
            if(item.uid==file.uid){
                id=item.upload_id
            }
        })
        if(id){
            let res = await request.post(config.ApiHOST+'/admin/system/op/upload/del',{ids:[id]})
            console.log(res)
            if(!res.code){

            }
            message.info(res.msg)
        }
        
       
    };
    
    async function UploadInfo(){
        let res = await request.get(config.ApiHOST+'/admin/system/op/upload/info',{params:{id:31}})
        if(!res.code){
            var fileStream = base64ToBlob(res.data.info.content,res.data.info.file_type);
            var imageUrl = URL.createObjectURL(fileStream);
            upload.src = imageUrl
        }
    }

    function afterOpenChange(b){
        
    }

    

    
</script>

<style lang="scss" scoped>

</style>