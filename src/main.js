import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const modules = import.meta.glob('/src/views/**/*.vue')
let role_menu = localStorage.getItem("role_menu")
if(role_menu){
    role_menu = JSON.parse(role_menu)
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
}

import  {treeToList}  from '@/helper/tree.js';
import  {adminAccountRouter}  from '@/router/account.js';
let adminAccountRouterList = treeToList(adminAccountRouter)
adminAccountRouterList.forEach(item => {
    if(item.menuType==2){
        router.addRoute("admin_account_layout",{
            path: item.path,
            name: item.name,
            component: modules[`/src/views${item.path}.vue`],
            meta: { requiresAuth: true }
        })
    }
});


const app = createApp(App)

app.config.productionTip = false;

app.use(Antd);

app.use(createPinia())
app.use(router)

app.mount('#app')

import { useManagerStore } from '@/stores/manager'
let manager = useManagerStore()
manager.init()

