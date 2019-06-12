import axios from 'axios';

const state = {
  // initial state for users
  users: [],
  userToEdit: {}
};

const getters = {
  // get users from central storage
  users: state => state.users,

  // get single user from central storage
  userToEdit: state => state.userToEdit
};

const actions = {
  // fetch users from database and set value for mutation
  async fetchUsers({ commit }) {
    const response = await axios.get('/users.json');

    commit('setUsers', response.data);
  },

  // fetch single user from database and set value for mutation
  async fetchSingleUser({ commit }, _id) {
    const response = await axios.get(
      `http://192.168.1.20:3000/api/users/${_id}`
    );

    commit('setUserToEdit', response.data);

    return {
      response
    };
  },

  // add a user to the database and set value for mutation
  async addUser({ commit }, user) {
    const response = await axios.post('/users.json', user);

    commit('newUser', response.data);
  },

  // remove a user from the database and set value for mutation
  async deleteUser({ commit }, _id) {
    if (confirm('Besucher*in wirklich löschen?')) {
      await axios.delete(`http://192.168.1.20:3000/api/users/${_id}`);

      commit('removeUser', _id);
    }
  },

  // edit a user in the database and reset userToEdit state
  async editUser({ commit }, user) {
    const response = await axios.put(
      `http://192.168.1.20:3000/api/users/${user._id}`,
      user
    );

    commit('updateUser', response.data);
  }
};

const mutations = {
  // push new user to state of users
  newUser: (state, user) => state.users.push(user),

  // filter state of users for ID and remove it from storage
  removeUser: (state, _id) =>
    (state.users = state.users.filter(user => user._id !== _id)),

  // set state of users to new value
  setUsers: (state, users) => (state.users = users),

  // set state of user to edit to new value
  setUserToEdit: (state, userToEdit) => (state.userToEdit = userToEdit),

  // reset userToEdit state
  clearUserToEdit: state => (state.userToEdit = {}),

  // find user in array and replace it with new one
  updateUser: (state, user) => {
    const index = state.users
      .map(e => {
        return e._id;
      })
      .indexOf(user._id);

    state.users.splice(index, 1, user);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
