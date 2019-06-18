import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/entry',
      name: 'entry',
      component: () => import('./views/Entry.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('./views/Users.vue')
    },
    {
      path: '/partners',
      name: 'partners',
      component: () => import('./views/Partners.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('./views/Statistics.vue')
    },
    {
      path: '/stamm',
      name: 'stamm',
      component: () => import('./views/Stamm.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    }
  ]
});
