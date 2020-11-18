import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {postKeyValueRequest} from "@/utils/api";
import {postRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";
import 'font-awesome/css/font-awesome.min.css';

// 做成插件
Vue.prototype.postKeyValueRequest = postKeyValueRequest; // 引用
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

// 全局控制控件
// Vue.use(ElementUI, {size: 'mini'});
Vue.use(ElementUI);

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 继续执行的方法
  // next();
  if (to.path == '/') {
    next();
  } else {
    if (window.sessionStorage.getItem("user")){
      initMenu(router, store);
      next();
    }else {
      // next('/');
      next('?redirect='+to.path)
    }
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
