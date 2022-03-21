import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store/store';
import axios from 'axios';
import VueApexCharts from 'vue-apexcharts';
import excel from 'vue-excel-export';

Vue.use(VueApexCharts);

Vue.use(excel);

axios.defaults.baseURL = 'https://prozessor-vuebase.firebaseio.com';
axios.defaults.headers.get['Accepts'] = 'application/json';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
