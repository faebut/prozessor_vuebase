import axios from '../../axios-auth';

const state = {
  // initial state for logins
  idToken: null,
  userId: null
};

const getters = {};

const actions = {
  login({ commit }, authData) {
    axios
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
      });
  }
};

const mutations = {
  authUser(state, userData) {
    (state.idToken = userData.token), (state.userId = userData.userId);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
