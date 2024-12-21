<template>
    <div class="adminMainTitle">
        <div class="nav-title">
            {{ currRouterTitle }}
        </div>
    </div>
</template>
<script setup>
    import {ref,onMounted} from "vue"
    import { useRouter } from 'vue-router';
    const router = useRouter();
    let currRouterTitle = ref('');
    onMounted(()=>{
        let role_menu =localStorage.getItem("role_menu")
        if(role_menu){
            role_menu = JSON.parse(role_menu)
            currRouterTitle.value = role_menu.filter(i=>{
                return i.Menu.name==router.currentRoute.value.name
            })[0].Menu.title
        }
    })
</script>
