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
    const response = await axios.get('http://192.168.1.20:3000/api/partners');

    commit('setPartners', response.data);
  },

  // add a partner to the database and set value for mutation
  async addPartner({ commit }, partner) {
    const response = await axios.post(
      'http://192.168.1.20:3000/api/partners',
      partner
    );

    commit('newPartner', response.data);
  },

  // remove a partner from the database and set value for mutation
  async deletePartner({ commit }, _id) {
    if (confirm('Besucher*in wirklich löschen?')) {
      await axios.delete(`http://192.168.1.20:3000/api/partners/${_id}`);

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
  setPartners: (state, partners) => (state.partners = partners)
};

export default {
  state,
  getters,
  actions,
  mutations
};
