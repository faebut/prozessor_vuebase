import axios from 'axios';
import auth from './auth';

const state = {
  // initial state for ateliers
  ateliers: [],
  atelierToEdit: {}
};

const getters = {
  // get ateliers from central storage
  ateliers: state => state.ateliers,

  // get single atelier from central storage
  atelierToEdit: state => state.atelierToEdit
};

const actions = {
  // fetch ateliers from database and set value for mutation
  async fetchAteliers({ commit }) {
    const response = await axios.get(
      '/ateliers.json' + '?auth=' + auth.state.idToken
    );

    commit('setAteliers', response.data);
  },

  // fetch single atelier from database and set value for mutation
  async fetchSingleAtelier({ commit }, _id) {
    const response = await axios.get(
      `/ateliers/${_id}.json` + '?auth=' + auth.state.idToken
    );

    commit('setAtelierToEdit', response.data);

    return {
      response
    };
  },

  // add a atelier to the database and set value for mutation
  async addAtelier({ commit }, atelier) {
    const response = await axios.post(
      '/ateliers.json' + '?auth=' + auth.state.idToken,
      atelier
    );
    // get the data in the database with the generated key from the post request
    const newdata = await axios.get(
      `/ateliers/${response.data.name}.json` + '?auth=' + auth.state.idToken
    );

    // assign the data from the get request to a new variable
    const newatelier = newdata.data;

    // add the generated ID to the Object so the state can be mutated
    newatelier._id = response.data.name;

    commit('newAtelier', newatelier);
  },

  // remove a atelier from the database and set value for mutation
  async deleteAtelier({ commit }, _id) {
    if (confirm('Atlier wirklich löschen?')) {
      await axios.delete(
        `/ateliers/${_id}.json` + '?auth=' + auth.state.idToken
      );

      commit('removeAteliers', _id);
    }
  },

  // edit a atelier in the database and reset atelierToEdit state
  async editAtelier({ commit }, atelier) {
    const response = await axios.put(
      `/ateliers/${atelier._id}.json` + '?auth=' + auth.state.idToken,
      atelier
    );

    commit('updateAtelier', response.data);
  }
};

const mutations = {
  // push new atelier to state of ateliers
  newAtelier: (state, atelier) => {
    state.ateliers.push(atelier);
  },

  // filter state of ateliers for ID and remove it from storage
  removeAteliers: (state, _id) =>
    (state.ateliers = state.ateliers.filter(atelier => atelier._id !== _id)),

  // set state of ateliers to new value
  setAteliers: (state, ateliers) => {
    const atelierarray = [];
    for (let key in ateliers) {
      const newatelier = ateliers[key];
      newatelier._id = key;
      atelierarray.push(newatelier);
    }
    state.ateliers = atelierarray;
  },
  // set state of atelier to edit to new value
  setAtelierToEdit: (state, atelierToEdit) =>
    (state.atelierToEdit = atelierToEdit),

  // reset userToEdit state
  clearAtelierToEdit: state => (state.atelierToEdit = {}),

  // find user in array and replace it with new one
  updateAtelier: (state, atelier) => {
    const index = state.ateliers
      .map(e => {
        return e._id;
      })
      .indexOf(atelier._id);

    state.ateliers.splice(index, 1, atelier);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
