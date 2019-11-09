import Vue from 'vue';
import App from './App.vue';

import store from './store.js';
import router from './router.js';
var VueCookie = require('vue-cookie');
Vue.use(VueCookie);

import VueYoutube from 'vue-youtube';
Vue.use(VueYoutube);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
