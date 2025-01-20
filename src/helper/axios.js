import axios from 'axios';
import {config} from '@/config/index.js';
import { useUserStore } from '@/stores/user'

const Axios = axios.create({
  baseURL: config.ApiHOST, 
  timeout: 5000 
});
 
Axios.interceptors.request.use(
  conf => {
    const user = useUserStore()
    if(user.loginStatus){
      conf.headers['X-Token'] = user.token.access_token;
    }
    return conf;
  },
  error => {
    console.log(error); 
    Promise.reject(error);
  }
);
 
async function refreshToken(conf) {
  const user = useUserStore()
  try {
    const res = await axios({
      url: config.ApiHOST+'/account/refresh_token', 
      headers: {
        'X-Token': user.token.refresh_token
      },
    })
    if(!res.data.code && res.data.data.user.access_token){
      user.updateAccessToken(res.data.data.user.access_token)
      return Axios(conf);
    }else{
      user.logout()
      return res.data;
    }
  } catch (err) {
    user.logout()
    return Promise.reject(err);
  }
}

Axios.interceptors.response.use(
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
 
export default Axios;