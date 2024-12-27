<template>
  <div>
    <a-layout class="adminLayout">
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible style="background-color: #fff;">
        <div class="adminLogo" >
          管理中心
        </div>
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
        <a-layout-header class="adminHeader" >
          <icon-font type="admin-px1" v-if="collapsed"  class="trigger" @click="() => {collapsed = !collapsed}" />
          <icon-font type="admin-px" v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          <div class="adminHeader2">
            <div style="padding:0 10px;">
              <icon-font type="admin-tixing" style="font-size: 28px;padding-top: 24px;" />
            </div>
            
            <a-dropdown>
              <a class="ant-dropdown-link adminAvatar" @click.prevent style="">
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
                  <a-menu-item @click="router.push('/admin/account/index')">个人中心</a-menu-item>
                  <a-menu-item @click="router.push('/admin/select_role')">更换角色</a-menu-item>
                  <a-menu-item @click="Logout()">退出</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
         
        </a-layout-header>
        
        <a-layout-content class="adminMainP">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div> 
</template>

<script setup>
    import { ref,onMounted ,watch } from 'vue';
    import { useManagerStore } from '@/stores/manager'
    import { createFromIconfontCN } from '@ant-design/icons-vue';
    import { message } from 'ant-design-vue';
    import { useRouter } from 'vue-router';
    const IconFont = createFromIconfontCN({
      scriptUrl: '//at.alicdn.com/t/c/font_4769810_0gp1c0qzq88m.js',
    });
    import  request  from '@/helper/request.js';
    import  {listToMenu,OpenKeysSelectedKeysByTree}  from '@/helper/tree.js';
    const router = useRouter();
    const manager = useManagerStore()
    const openKeys = ref([]);
    const selectedKeys = ref([]);
    const collapsed = ref(false);
    const roleMenu = ref([]);
    function getImageUrl() {
      return new URL(`/src/assets/image/avatar/${manager.avatar}`, import.meta.url).href
    }
    function Logout(){
      manager.logout()
      router.push("/admin/login")
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