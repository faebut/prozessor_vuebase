import Vue from 'vue';
import Vuex from 'vuex';

// import the objects from the modules
import users from './modules/users';
import partners from './modules/partners';
import snackbar from './modules/snackbar';
import entry from './modules/entry';
import ateliers from './modules/ateliers';
import auth from './modules/auth';
import badges from './modules/badges';

Vue.use(Vuex);

export default new Vuex.Store({
  // include modules in central store
  modules: {
    users,
    partners,
    snackbar,
    entry,
    ateliers,
    auth,
    badges
  }
});
