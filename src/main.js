// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap' 
import { ValidationObserver, ValidationProvider, extend, localize, configure } from 'vee-validate';
import TW from 'vee-validate/dist/locale/zh_TW.json'
import * as rules from 'vee-validate/dist/rules';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import App from './App'
import router from './router'
import './bus'
import CurrenctFilter from './filters/currency'
//axios
Vue.config.productionTip = false
axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios)
//驗證
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});
localize('zh_TW', TW);

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
});
//過濾
Vue.filter('currency' , CurrenctFilter)

Vue.component('Loading',Loading)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  if(to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`
    axios.post(api).then((response) => {
        console.log(response.data)
        if(response.data.success){
          next()
        }else{
          next({path:'/login'});
        }
    })
  }else{
    next()
  }

})
