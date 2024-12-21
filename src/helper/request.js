import axios from 'axios';
import {config} from '@/config/index.js';
import { useManagerStore } from '@/stores/manager'

const request = axios.create({
  baseURL: config.ApiHOST, 
  timeout: 5000 
});
 
request.interceptors.request.use(
  conf => {
    const manager = useManagerStore()
    if(manager.loginStatus){
      conf.headers['X-Token'] = manager.token.access_token;
    }
    let role_id = manager.roleInfo.id;
    if(role_id){
      conf.headers['X-RoleId'] = role_id;
    }
    return conf;
  },
  error => {
    console.log(error); 
    Promise.reject(error);
  }
);
 
async function refreshToken(conf) {
  const manager = useManagerStore()
  try {
    const res = await axios({
      url: config.ApiHOST+'/admin/refresh_token', 
      headers: {
        'X-Token': manager.token.refresh_token
      },
    })
    if(!res.data.code && res.data.data.manager.access_token){
      manager.updateAccessToken(res.data.data.manager.access_token)
      return request(conf);
    }else{
      manager.logout()
      return res.data;
    }
  } catch (err) {
    manager.logout()
    return Promise.reject(err);
  }
}

request.interceptors.response.use(
  async response => {
    const res = response.data;
    if(res.code===402 && !response.config._retry){
      response.config._retry = true;
      return await refreshToken(response.config)
    }
    return res;
  },
  error => {
    console.log('err' + error); 
    return Promise.reject(error);
  }
);
 
export default request;