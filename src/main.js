import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store/store';
import axios from 'axios';

axios.defaults.baseURL = 'https://prozessor-vuebase.firebaseio.com';
axios.defaults.headers.get['Accepts'] = 'application/json'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
