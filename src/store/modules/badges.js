import axios from 'axios';
import auth from './auth';

const state = {
  // initial state for ateliers
  badges: [],
  badgeToEdit: {}
};

const getters = {
  // get ateliers from central storage
  badges: state => state.badges,

  // get single atelier from central storage
  badgeToEdit: state => state.badgeToEdit
};

const actions = {
  // fetch ateliers from database and set value for mutation
  async fetchBadges({ commit }) {
    const response = await axios.get(
      '/badges.json' + `?auth=${auth.state.idToken}`
    );

    commit('setBadges', response.data);
  },

  // fetch single atelier from database and set value for mutation
  async fetchSingleBadge({ commit }, _id) {
    const response = await axios.get(
      `/badges/${_id}.json` + `?auth=${auth.state.idToken}`
    );

    commit('setBadgeToEdit', response.data);

    return {
      response
    };
  },

  // add a atelier to the database and set value for mutation
  async addBadge({ commit }, badge) {
    const response = await axios.post(
      '/badges.json' + `?auth=${auth.state.idToken}`,
      badge
    );
    // get the data in the database with the generated key from the post request
    const newdata = await axios.get(
      `/badges/${response.data.name}.json` + `?auth=${auth.state.idToken}`
    );

    // assign the data from the get request to a new variable
    const newbadge = newdata.data;

    // add the generated ID to the Object so the state can be mutated
    newbadge._id = response.data.name;

    commit('newBadge', newbadge);
  },

  // remove a badge from the database and set value for mutation
  async deleteBadge({ commit }, _id) {
    if (confirm('Badge wirklich löschen?')) {
      await axios.delete(`/badges/${_id}.json` + `?auth=${auth.state.idToken}`);

      commit('removeBadge', _id);
    }
  },

  // edit a atelier in the database and reset atelierToEdit state
  async editBadge({ commit }, badge) {
    const response = await axios.put(
      `/badges/${badge._id}.json` + `?auth=${auth.state.idToken}`,
      badge
    );

    commit('updateBadge', response.data);
  }
};

const mutations = {
  // push new atelier to state of badges
  newBadge: (state, badge) => {
    state.badges.push(badge);
  },

  // filter state of badges for ID and remove it from storage
  removeBadge: (state, _id) =>
    (state.badges = state.badges.filter(badge => badge._id !== _id)),

  // set state of badges to new value
  setBadges: (state, badges) => {
    const badgearray = [];
    for (const key in badges) {
      const newbadge = badges[key];
      newbadge._id = key;
      badgearray.push(newbadge);
    }
    state.badges = badgearray;
  },
  // set state of bdage to edit to new value
  setBadgeToEdit: (state, badgeToEdit) => (state.badgeToEdit = badgeToEdit),

  // reset badgeToEdit state
  clearBadgeToEdit: state => (state.badgeToEdit = {}),

  // find badge in array and replace it with new one
  updateBadge: (state, badge) => {
    const index = state.badges.map(e => e._id).indexOf(badge._id);

    state.badges.splice(index, 1, badge);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
