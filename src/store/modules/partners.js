import axios from 'axios';
import auth from './auth';

const state = {
  // initial state for partners
  partners: [],
  partnerToEdit: {},
};

const getters = {
  // get partners from central storage
  partners: (state) => state.partners,

  // get single partner from central storage
  partnerToEdit: (state) => state.partnerToEdit,
};

const actions = {
  // fetch partners from database and set value for mutation
  async fetchPartners({ commit }) {
    const response = await axios.get(
      '/partners.json' + '?auth=' + auth.state.idToken
    );

    commit('setPartners', response.data);
  },

  // fetch single partner from database and set value for mutation
  async fetchSinglePartner({ commit }, _id) {
    const response = await axios.get(
      `/partners/${_id}.json` + '?auth=' + auth.state.idToken
    );

    commit('setPartnerToEdit', response.data);

    return {
      response,
    };
  },

  // add a partner to the database and set value for mutation
  async addPartner({ commit }, partner) {
    const response = await axios.post(
      '/partners.json' + '?auth=' + auth.state.idToken,
      partner
    );
    // get the data in the database with the generated key from the post request
    const newdata = await axios.get(
      `/partners/${response.data.name}.json` + '?auth=' + auth.state.idToken
    );

    // assign the data from the get request to a new variable
    const newpartner = newdata.data;

    // add the generated ID to the Object so the state can be mutated
    newpartner._id = response.data.name;

    commit('newPartner', newpartner);
  },

  // remove a partner from the database and set value for mutation
  async deletePartner({ commit }, _id) {
    if (confirm('Partner*in wirklich löschen?')) {
      await axios.delete(
        `/partners/${_id}.json` + '?auth=' + auth.state.idToken
      );

      commit('removePartner', _id);
    }
  },

  // edit a partner in the database and reset partnerToEdit state
  async editPartner({ commit }, partner) {
    const response = await axios.put(
      `/partners/${partner._id}.json` + '?auth=' + auth.state.idToken,
      partner
    );

    commit('updatePartner', response.data);
  },
};

const mutations = {
  // push new partner to state of partners
  newPartner: (state, partner) => {
    state.partners.push(partner);
  },

  // filter state of partners for ID and remove it from storage
  removePartner: (state, _id) =>
    (state.partners = state.partners.filter((partner) => partner._id !== _id)),

  // set state of partners to new value
  setPartners: (state, partners) => {
    const partnerarray = [];
    for (let key in partners) {
      const newpartner = partners[key];
      newpartner._id = key;
      partnerarray.push(newpartner);
    }
    state.partners = partnerarray;
  },
  // set state of partner to edit to new value
  setPartnerToEdit: (state, partnerToEdit) =>
    (state.partnerToEdit = partnerToEdit),

  // reset userToEdit state
  clearPartnerToEdit: (state) => (state.partnerToEdit = {}),

  // find user in array and replace it with new one
  updatePartner: (state, partner) => {
    const index = state.partners
      .map((e) => {
        return e._id;
      })
      .indexOf(partner._id);

    state.partners.splice(index, 1, partner);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
