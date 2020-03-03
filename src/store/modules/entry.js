import axios from 'axios';
import auth from './auth';

const state = {
  loggedIn: []
};

const getters = {
  // get users from central storage
  loggedIn: state => state.loggedIn
};

const actions = {
  // add a entry to the user to the database and set value for mutation
  // eslint-disable-next-line no-empty-pattern
  async addEntry({ commit }, user) {
    await axios.put(`/users/${user._id}/visits.json` + '?auth=' + auth.state.idToken, user.visits);

    commit('addLoggedIn', user);
  },
  // getting List of logged in Users
  async usersLoggedIn({ commit }) {
    const response = await axios.get('/users.json' + '?auth=' + auth.state.idToken);

    commit('setLoggedIn', response.data);
  },
  async deleteVisit({ commit }, user) {
    if (
      confirm(`Besuch von ${user.firstname} ${user.name} wirklich löschen?`)
    ) {
      await axios.delete(
        `/users/${user._id}/visits/${user.visits.length - 1}.json` + '?auth=' + auth.state.idToken
      );

      commit('removeVisit', user._id);
    }
  }
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
    userarray.forEach(user => {
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
  addLoggedIn: (state, newuser) => state.loggedIn.push(newuser),
  removeVisit: (state, _id) =>
    (state.loggedIn = state.loggedIn.filter(user => user._id !== _id))
};

export default {
  state,
  getters,
  actions,
  mutations
};
