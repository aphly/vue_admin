<template>
    <div>
        <a-drawer
            title="头像"
            :open="props.open"
            @close="drawerAvatarClose"
            @afterOpenChange = "afterOpenChange"
        >
            <a-upload
                :multiple="false"
                :customRequest="customRequest"
                >
                <a-button>
                上传
                </a-button>
            </a-upload>
            <div>
                <img :src="upload.src" style="width: 200px;height: 200px;">
            </div>
        </a-drawer>
    </div>
</template>

<script setup>
    import {reactive,defineEmits,ref} from "vue"
    import request  from "@/helper/request";
    import { message } from 'ant-design-vue';
    import {config} from '@/config/index.js';

    let props =  defineProps(['open','record'])

    const emit = defineEmits(['drawe_avatar_close']);
   
    function drawerAvatarClose(){
        emit('drawe_avatar_close', false);
    }

    let upload = reactive({
        fileList:[],
        src:config.ApiHOST+'/public/img/avatar.png'
    })

    const customRequest = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        const formData = new FormData();
        formData.append('file', file);
        let res = await request.post(config.ApiHOST+'/common/user/avatar?uid='+props.record.uid,formData)
        if(!res.code){
            onSuccess("uploadd success");
            upload.src = res.data.url;
        }else{
            onError("upload error");
            message.info(res.msg)
        }
    }

    function afterOpenChange(b){
        if(props.record.avatar){
            upload.src = props.record.avatar
        }else{
            upload.src = config.ApiHOST+'/public/img/avatar.png'
        }
    }

    

    
</script>


<style lang="scss" scoped>

</style>