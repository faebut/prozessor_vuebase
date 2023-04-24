import axios from 'axios';
import auth from './auth';

const state = {
  loggedIn: [],
  actualPayment: {},
};

const getters = {
  // get users from central storage
  loggedIn: (state) => state.loggedIn,
  // get actual payment from central storage
  actualPayment: (state) => state.actualPayment,
};

const actions = {
  // add a entry to the user to the database and set value for mutation
  // eslint-disable-next-line no-empty-pattern
  async addEntry({ commit }, user) {
    await axios.put(
      `/users/${user._id}/visits.json` + '?auth=' + auth.state.idToken,
      user.visits
    );

    commit('addLoggedIn', user);
  },
  // getting List of logged in Users
  async usersLoggedIn({ commit }) {
    const response = await axios.get(
      '/users.json' + '?auth=' + auth.state.idToken
    );

    commit('setLoggedIn', response.data);
  },
  async deleteVisit({ commit }, user) {
    if (
      confirm(`Besuch von ${user.firstname} ${user.name} wirklich löschen?`)
    ) {
      await axios.delete(
        `/users/${user._id}/visits/${user.visits.length - 1}.json` +
          '?auth=' +
          auth.state.idToken
      );

      commit('removeVisit', user._id);
    }
  },
  async getPayment({ commit }, user) {
    const response = await axios.get(
      `/users/${user._id}/visits/${user.visits.length - 1}/paid.json` +
        '?auth=' +
        auth.state.idToken
    );

    commit('setPayment', response.data);

    return {
      response,
    };
  },
  async addPayment({ commit }, payment) {
    await axios.put(
      `/users/${payment.user._id}/visits/${
        payment.user.visits.length - 1
      }/paid.json` +
        '?auth=' +
        auth.state.idToken,
      payment.paid
    );

    commit('paidVisit', payment);
  },
  async deletePayment({ commit }, user) {
    if (confirm(`Bezahlung wirklich löschen?`)) {
      await axios.delete(
        `/users/${user._id}/visits/${user.visits.length - 1}/paid.json` +
          '?auth=' +
          auth.state.idToken
      );

      commit('unPaidVisit', user);
    }
  },
};

const mutations = {
  // set state of logged in users to new value
  setLoggedIn: (state, users) => {
    const userarray = [];
    for (let key in users) {
      const newuser = users[key];
      newuser._id = key;
      userarray.push(newuser);
    }

    // get todays Date without time
    const dateNow = new Date().setHours(0, 0, 0, 0);
    // empty array for logged in users
    const loggedIn = [];

    // check whos logged in
    userarray.forEach((user) => {
      // check for users that have already visited
      if (user.visits) {
        // get the last visit of the user
        const lastVisit = user.visits[user.visits.length - 1];
        // get the date of the last visit
        const dateLastVisit = new Date(lastVisit.date).setHours(0, 0, 0, 0);
        // check if the date of the last visit is the same as today
        if (dateLastVisit === dateNow) {
          loggedIn.push(user);
        }
      }
    });

    state.loggedIn = loggedIn;
  },
  setPayment: (state, payment) => {
    state.actualPayment = payment;
  },
  paidVisit: (state, payment) => {
    for (let i = 0; i < state.loggedIn.length; i++) {
      if (state.loggedIn[i]._id === payment.user._id) {
        state.loggedIn[i].visits[
          state.loggedIn[i].visits.length - 1
        ].paid = true;
      }
    }
  },
  unPaidVisit: (state, user) => {
    for (let i = 0; i < state.loggedIn.length; i++) {
      if (state.loggedIn[i]._id === user._id) {
        state.loggedIn[i].visits[
          state.loggedIn[i].visits.length - 1
        ].paid = false;
      }
    }
  },
  addLoggedIn: (state, newuser) => state.loggedIn.push(newuser),
  removeVisit: (state, _id) =>
    (state.loggedIn = state.loggedIn.filter((user) => user._id !== _id)),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
