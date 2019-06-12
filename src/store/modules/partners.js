import axios from 'axios';

const state = {
  // initial state for partners
  partners: []
};

const getters = {
  // get partners from central storage
  partners: state => state.partners
};

const actions = {
  // fetch partners from database and set value for mutation
  async fetchPartners({ commit }) {
    const response = await axios.get('/partners.json');

    commit('setPartners', response.data);
  },

  // add a partner to the database and set value for mutation
  async addPartner({ commit }, partner) {
    const response = await axios.post('/partners.json', partner);

    const newpartner = partner;
    newpartner._id = response.data.name;

    commit('newPartner', newpartner);
  },

  // remove a partner from the database and set value for mutation
  async deletePartner({ commit }, _id) {
    if (confirm('Besucher*in wirklich löschen?')) {
      await axios.delete(`/partners/${_id}.json`);

      commit('removePartner', _id);
    }
  }
};

const mutations = {
  // push new partner to state of partners
  newPartner: (state, partner) => state.partners.push(partner),

  // filter state of partners for ID and remove it from storage
  removePartner: (state, _id) =>
    (state.partners = state.partners.filter(partner => partner._id !== _id)),

  // set state of partners to new value
  setPartners: (state, partners) => {
    const partnerarray = [];
    for (let key in partners) {
      const newpartner = partners[key];
      newpartner._id = key;
      partnerarray.push(newpartner);
    }
    state.partners = partnerarray;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
