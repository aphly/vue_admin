<template>
    <div class="adminLogo" @click="jump('/admin/home/index')">
        管理中心
    </div>
</template>
<script setup>
   import { useRouter } from 'vue-router';
   const router = useRouter();
   function jump(url){
    window.location.href=url;
   }
</script>
