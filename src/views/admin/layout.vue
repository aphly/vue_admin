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
    
    import { message } from 'ant-design-vue';
    import { useRouter } from 'vue-router';
    
    import  request  from '@/helper/request.js';
    import  {listToMenu,OpenKeysSelectedKeysByTree}  from '@/helper/tree.js';
    import AdminHeader from '@/components/admin/AdminHeader.vue';
    import AdminLogo from '@/components/admin/AdminLogo.vue';

    const router = useRouter();

    const roleMenu = ref([]);
    const openKeys = ref([]);
    const selectedKeys = ref([]);
   
    const collapsed = ref(false);
    function collapsedStatus(b){
      collapsed.value=b
    }
    
    onMounted(async()=>{
      let role_menu =localStorage.getItem("role_menu")
      if(role_menu){
        role_menu = JSON.parse(role_menu)
      }else{
        let res = await request.get("/admin/account/role_menu")
        if(!res.code){
          localStorage.setItem("role_menu",JSON.stringify(res.data.manager_role_menu))
          role_menu = res.data.manager_role_menu
          const modules = import.meta.glob('/src/views/**/*.vue')
          role_menu.forEach(item => {
            if(item.Menu.type==2){
              router.addRoute("layout",{
                path: item.Menu.path,
                name: item.Menu.name,
                component: modules[`/src/views${item.Menu.path}.vue`],
                meta: { requiresAuth: true }
              })
            }
          });
        }else{
          return message.info(
            res.msg
          );
        }
      }
      roleMenu.value = listToMenu(role_menu)

      if(router.currentRoute.value.path=='/admin/layout'){
        router.push("/admin/home/index")
      } 
      let os_keys = OpenKeysSelectedKeysByTree(router.currentRoute.value.path,role_menu)
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