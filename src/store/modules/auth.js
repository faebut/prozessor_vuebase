import axios from '../../axios-auth';
import router from '../../router';

const state = {
  // initial state for logins
  idToken: null,
  userId: null
};

const getters = {};

const actions = {
  setLogoutTimer({ dispatch }, expirationTime) {
    setTimeout(() => {
      dispatch('logout');
    }, expirationTime * 1000);
  },
  async login({ commit, dispatch }, authData) {
    await axios
      .post(
        '/accounts:signInWithPassword?key=AIzaSyAwcADep1pDUmKasNzaTu0bWDqH0Bj96mk',
        {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }
      )
      .then(res => {
        commit('authUser', {
          token: res.data.idToken,
          userId: res.data.localId
        });
        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + res.data.expiresIn * 1000
        );
        localStorage.setItem('token', res.data.idToken);
        localStorage.setItem('userId', res.data.localId);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch('setLogoutTimer', res.data.expiresIn);
      });
  },
  tryAutoLogin({ commit }) {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const expirationDate = localStorage.getItem('expirationDate');
    const now = new Date();
    if (now >= expirationDate) {
      return;
    }
    const userId = localStorage.getItem('userId');
    commit('authUser', {
      token: token,
      userId: userId
    });
  },
  logout({ commit }) {
    commit('clearAuthData');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.replace('/');
  }
};

const mutations = {
  authUser(state, userData) {
    (state.idToken = userData.token), (state.userId = userData.userId);
  },
  clearAuthData(state) {
    state.idToken = null;
    state.userId = null;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
