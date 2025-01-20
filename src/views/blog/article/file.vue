<template>
    <div class="adminMain">
        <RouterTitle></RouterTitle>
        <div class="mainTop">
            
        </div>

        <div class="mainContext">
            <div class="listBox">
                <a-upload
                        v-model:file-list="upload.fileList"
                        :name="upload.name"
                        :multiple="true"
                        :action="upload.action"
                        :headers="upload.headers"
                        @change="handleChange"
                    >
                    <a-button>
                    <upload-outlined></upload-outlined>
                    Click to Upload
                    </a-button>
                </a-upload>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {onMounted, reactive} from "vue"

    import { message } from 'ant-design-vue';
    import { UploadOutlined } from '@ant-design/icons-vue';
    import {config} from '@/config/index.js';
    
    import RouterTitle from '@/components/admin/RouterTitle.vue';
    import { useManagerStore } from '@/stores/manager'
    import { useRouter } from 'vue-router';
    const router = useRouter();
    const manager = useManagerStore()
    
    let upload = reactive({
        name:'file',
        headers:{
            "x-roleid":manager.roleInfo.id,
            "x-token":manager.token.access_token,
        },
        action: config.ApiHOST+'/blog/article/file', 
        fileList:[],
    })


    const handleChange = info => {
      if (info.file.status !== 'uploading') {
        console.log("ing ",info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if(!info.file.response.code){
            message.success(`${info.file.name} ok`);
        }else{
            message.success(info.file.response.msg);
            upload.fileList=[]
        }
        
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
        upload.fileList=[]
      }
    };

    onMounted(async()=>{
        
    })

   
</script>

<style lang="scss" scoped>

</style>