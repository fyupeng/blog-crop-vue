import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)


import {
  Button,
  Swipe,
  SwipeItem,
  Lazyload,
  Tabbar,
  TabbarItem,
  NavBar,
  Dialog,
  Popup,
  Picker,
  Field,
  Form,
  Toast,
  Divider,
  Radio,
  RadioGroup,
  checkbox,
  Search,
  Uploader,
  Popover,
  DatetimePicker,
  Sidebar,
  SidebarItem,
  Progress,
} from 'vant'
Vue.use(Button);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(NavBar);
Vue.use(Dialog);
Vue.use(Popup);
Vue.use(Picker);
Vue.use(Field);
Vue.use(Form);
Vue.use(Toast);
Vue.use(Divider);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(checkbox);
Vue.use(Search);
Vue.use(Uploader);
Vue.use(Popover);
Vue.use(DatetimePicker);
Vue.use(Sidebar);
Vue.use(SidebarItem);
Vue.use(Progress);

//base 图片转码
import Base64 from 'js-base64'

// 编辑器
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
Vue.use(mavonEditor);

// 视频支持
import Video from 'video.js'
import 'video.js/dist/video-js.css'
 
Vue.prototype.$video = Video




//设置Vue原型属性
Vue.prototype.remoteUrl = 'https://www.fyupeng.cn:9090'; // 这是拿静态资源的后端接口地址（springboot做了url映射处理）
Vue.prototype.remoteDataDir = '/distributed-blog-data/';
//axios拦截器，在发起请求之前执行

// axios.interceptors.request.use(config => {

//   //处理post请求参数, 进行参数序列化
//   if (config.method == 'post') {
//     //序列化post请求参数
//     let paramsString = '';
//     for (let key in config.data) {
//       paramsString += `${key}=${config.data[key]}&`;
//     }
//     //重新赋值config.data
//     config.data = paramsString.slice(0, -1);
//     // 
//   }
//   //必须返回config
//   return config;
// })

// axios.interceptors.request.use(
//   config => {
    // if (localStorage.getItem('token')) {
    //   // 如果后台要token这么写：
    //   config.headers.token = localStorage.getItem('token')
    //   // 如果后台要Authorization 这么写：config.headers.Authorization = `Bearer ` + localStorage.getItem('token')
    // }
//         return config
//     },
//     error =>{
//       console.log("this axios inteceptors error info")
//       console.log(error)
//         return Promise.reject(error)
//     }
// )





import 'lib-flexible/flexible'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
