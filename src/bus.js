import Vue from 'vue'

Vue.prototype.$bus = new Vue();


//Message
//this.$bus.$emit('message:push',message,status);
//message: 訊息內容
//status: alert樣式-bootstrap
