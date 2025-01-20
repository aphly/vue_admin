<template>
  <div>
    <a-layout class="adminLayout">
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible style="background-color: #fff;">
        <AdminLogo></AdminLogo>
        <div class="adminMenu">
          <a-menu  v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            :items="roleMenu"
            @click="handleClick"
          ></a-menu>
        </div>
        
      </a-layout-sider>
      <a-layout>
        <AdminHeader :collapsed="collapsed" @status="collapsedStatus"></AdminHeader>
        
        <a-layout-content class="adminMainP">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div> 
</template>

<script setup>
    import { ref,onMounted ,watch } from 'vue';
    import AdminLogo from '@/components/admin/AdminLogo.vue';
    import AdminHeader from '@/components/admin/AdminHeader.vue';
    import { useRouter} from 'vue-router';
    
    import  {treeToList,OpenKeysSelectedKeysByRouter}  from '@/helper/tree.js';
    const router = useRouter();
    import  {adminAccountRouter}  from '@/router/account.js';
    
    const roleMenu = ref(adminAccountRouter);
    const openKeys = ref([]);
    const selectedKeys = ref([]);

    const collapsed = ref(false);
    function collapsedStatus(b){
      collapsed.value=b
    }

    onMounted(async()=>{
      
      let list = treeToList(adminAccountRouter)
      const modules = import.meta.glob('/src/views/**/*.vue')
      list.forEach(item => {
        if(item.menuType==2){
          router.addRoute("admin_account_layout",{
            path: item.path,
            name: item.name,
            component: modules[`/src/views${item.path}.vue`],
            meta: { requiresAuth: true }
          })
        }
      });
      
      if(router.currentRoute.value.path=='/admin/account/layout'){
        router.push("/admin/account/index")
      } 

      let os_keys = OpenKeysSelectedKeysByRouter(router.currentRoute.value.path,roleMenu.value)
      openKeys.value = os_keys[0]
      selectedKeys.value = os_keys[1] 
 		})
    const handleClick = e => {
      router.push(e.item.path)
    };
    watch(openKeys, val => {
      //console.log('openKeys', val);
    });

    
</script>

<style lang="scss" scoped>

</style>