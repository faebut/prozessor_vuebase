import axios from '../../axios-auth';
import router from '../../router';

const state = {
  // initial state for logins
  idToken: null,
  userId: null
};

const getters = {};

const actions = {
  // set Timer for auto Logout after the Token has expired
  setLogoutTimer({ dispatch }, expirationTime) {
    setTimeout(() => {
      dispatch('logout');
    }, expirationTime * 1000);
  },
  // login function after using the login form
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
        // send the response to the function that stores it
        commit('authUser', {
          token: res.data.idToken,
          userId: res.data.localId
        });
        // get the time to know when the auto logout takes place
        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + res.data.expiresIn * 1000
        );
        // store the data in the local storage of the browser
        localStorage.setItem('token', res.data.idToken);
        localStorage.setItem('userId', res.data.localId);
        localStorage.setItem('expirationDate', expirationDate);
        // send the time to the logout timer
        dispatch('setLogoutTimer', res.data.expiresIn);
      });
  },
  // function to try to auto login after a refresh of the browser window
  tryAutoLogin({ commit, dispatch }) {
    // check if the token is saved in the local storage of the browser
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    // check if the logout
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    const now = new Date();
    if (now >= expirationDate) {
      return;
    }
    // calculate the new time-out duration
    const setTimer = (expirationDate.getTime() - now.getTime()) / 1000;
    // store the ID and the Token in the store
    const userId = localStorage.getItem('userId');
    commit('authUser', {
      token: token,
      userId: userId
    });
    // set a new timer for auto logout
    dispatch('setLogoutTimer', setTimer);
  },
  // function for loging out, delete the local storage and the store and send the user to the homepage
  logout({ commit }) {
    commit('clearAuthData');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.replace('/');
  }
};

const mutations = {
  // save the data in the store
  authUser(state, userData) {
    (state.idToken = userData.token), (state.userId = userData.userId);
  },
  // delete the data from the store
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
