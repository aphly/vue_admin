import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

let role_menu =localStorage.getItem("role_menu")
if(role_menu){
    role_menu = JSON.parse(role_menu)
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
}

const app = createApp(App)

app.config.productionTip = false;

app.use(Antd);

app.use(createPinia())
app.use(router)

app.mount('#app')

import { useManagerStore } from '@/stores/manager'
let manager = useManagerStore()
manager.init()

