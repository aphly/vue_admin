<template>
    <a-layout-header class="adminHeader" >
        <i class="vue_icon admin-px1 trigger" v-if="collapsed"   @click="status" ></i>
        <i class="vue_icon admin-px trigger" v-else @click="status" ></i>
        <div class="adminHeader2">
            <div style="padding:0 10px;cursor: pointer;" @click="jump('/admin/account/notice/index');">
                <i class="vue_icon admin-tixing" style="font-size: 28px;padding-top: 24px;" ></i>
            </div>
            <a-dropdown>
                <a class="ant-dropdown-link adminAvatar" @click.prevent >
                <div class="adminAvatar1">
                    <div class="adminAvatar11">{{ manager.info.username }}</div>
                    <div class="adminAvatar12">{{ manager.roleInfo.title }}</div>
                </div>
                <div class="adminAvatar2">
                    <img :src="getImageUrl()">
                </div>
                </a>
                <template #overlay>
                <a-menu>
                    <a-menu-item @click="jump('/admin/account/index');">个人中心</a-menu-item>
                    <a-menu-item @click="router.push('/admin/select_role')">更换角色</a-menu-item>
                    <a-menu-item @click="Logout()">退出</a-menu-item>
                </a-menu>
                </template>
            </a-dropdown>
        </div>
    </a-layout-header>
</template>
<script setup>
    import { ref} from 'vue';
    import { useManagerStore } from '@/stores/manager'
    import { useRouter } from 'vue-router';
    const router = useRouter();
    const manager = useManagerStore()

    let props =  defineProps(['collapsed'])

    const emit = defineEmits(['status']);
   
    const collapsed = ref(props.collapsed);

    function status(){
        collapsed.value = !collapsed.value
        emit('status', collapsed.value);
    }

    function jump(url){
        window.location.href=url;
    }

    function Logout(){
      manager.logout()
      router.push("/admin/login")
    }

    function getImageUrl() {
      return new URL(`/src/assets/image/avatar/${manager.avatar}`, import.meta.url).href
    }
</script>