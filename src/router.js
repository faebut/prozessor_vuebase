import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

import auth from './store/modules/auth';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/entry',
      name: 'entry',
      component: () => import('./views/Entry.vue'),
      beforeEnter(to, from, next) {
        if (auth.state.idToken) {
          next();
        } else {
          next('/');
        }
      },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('./views/Users.vue'),
      beforeEnter(to, from, next) {
        if (auth.state.idToken) {
          next();
        } else {
          next('/');
        }
      },
    },
    {
      path: '/badges',
      name: 'badges',
      component: () => import('./views/Badges.vue'),
      beforeEnter(to, from, next) {
        if (auth.state.idToken) {
          next();
        } else {
          next('/');
        }
      },
    },
    {
      path: '/partners',
      name: 'partners',
      component: () => import('./views/Partners.vue'),
      beforeEnter(to, from, next) {
        if (auth.state.idToken) {
          next();
        } else {
          next('/');
        }
      },
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('./views/Statistics.vue'),
      beforeEnter(to, from, next) {
        if (auth.state.idToken) {
          next();
        } else {
          next('/');
        }
      },
    },
    {
      path: '/stamm',
      name: 'stamm',
      component: () => import('./views/Stamm.vue'),
      beforeEnter(to, from, next) {
        if (auth.state.idToken) {
          next();
        } else {
          next('/');
        }
      },
    },
    {
      path: '/experts',
      name: 'experts',
      component: () => import('./views/Experts.vue'),
      beforeEnter(to, from, next) {
        if (auth.state.idToken) {
          next();
        } else {
          next('/');
        }
      },
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('./views/Registration.vue'),
    },
  ],
});
