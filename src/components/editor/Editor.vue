<template>
    <div style="border: 1px solid #f1f1f1;" >
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="{}"
            mode="simple"
        />
        <Editor
            style="height: 500px; overflow-y: hidden;"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            mode="simple"
            @onCreated="handleCreated"
            @onChange="handleChange"
        />
    </div>
</template>
<script setup>
    import {ref,shallowRef,onBeforeUnmount,watch,onMounted,nextTick} from "vue"
    import '@wangeditor/editor/dist/css/style.css'
    import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
    import {config} from '@/config/index.js';
    
    import request  from "@/helper/request";

    let props =  defineProps(['value','upload_url'])
    const emit = defineEmits(['update_value']);
    const editorConfig = { 
        placeholder:'',
        MENU_CONF:{} 
    }

    editorConfig.MENU_CONF['uploadImage'] = {
        async customUpload(file, insertFn) {
            //console.log(file)
            const formData = new FormData();
            formData.append('file', file);
            let res = await request.post(config.ApiHOST+props.upload_url,formData)
            if(!res.code){
                insertFn(res.data.url, '', '')
            }
            
        },
    }
    const editorRef = shallowRef()
    const valueHtml = ref('')

    onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
    })

    const handleCreated = (editor) => {
        editorRef.value = editor
    }

    const handleChange = () => { 
        valueHtml.value  = editorRef.value.getHtml()
        emit('update_value', valueHtml.value) 
    }

    watch(() => props.value, (newVal) => {
        nextTick(() => {
            if (editorRef.value) {
                editorRef.value.setHtml(newVal)
                valueHtml.value = newVal
            }
        })
    })

    onMounted(async() => {
        await nextTick(); 
        if(props.value) {
            valueHtml.value = props.value 
        }
    })
</script>
