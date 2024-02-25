import axios from 'axios';
import auth from './auth';

const state = {
  // initial state for users
  users: [],
  userToEdit: {},
};

const getters = {
  // get users from central storage
  users: (state) => state.users,

  // get single user from central storage
  userToEdit: (state) => state.userToEdit,
};

const actions = {
  // fetch users from database and set value for mutation
  async fetchUsers({ commit }) {
    const response = await axios.get(
      '/users.json' + '?auth=' + auth.state.idToken
    );

    commit('setUsers', response.data);
  },

  // fetch single user from database and set value for mutation
  async fetchSingleUser({ commit }, _id) {
    const response = await axios.get(
      `/users/${_id}.json` + '?auth=' + auth.state.idToken
    );

    commit('setUserToEdit', response.data);

    return {
      response,
    };
  },

  // add a user to the database and set value for mutation
  async addUser({ commit }, user) {
    const response = await axios.post(
      '/users.json' + '?auth=' + auth.state.idToken,
      user
    );
    // get the data in the database with the generated key from the post request
    const newdata = await axios.get(
      `/users/${response.data.name}.json` + '?auth=' + auth.state.idToken
    );

    // assign the data from the get request to a new variable
    const newuser = newdata.data;

    // add the generated ID to the Object so the state can be mutated
    newuser._id = response.data.name;

    // put the new ID back to the Object in the Database ///// DOES NOT WORK??
    axios.put(
      `/users/${response.data.name}/_id.json` + '?auth=' + auth.state.idToken,
      JSON.stringify(newuser._id)
    );

    commit('newUser', newuser);
  },

  // remove a user from the database and set value for mutation
  async deleteUser({ commit }, _id) {
    if (confirm('Besucher*in wirklich löschen?')) {
      await axios.delete(`/users/${_id}.json` + '?auth=' + auth.state.idToken);

      commit('removeUser', _id);
    }
  },

  // edit a user in the database and reset userToEdit state
  async editUser({ commit }, user) {
    const response = await axios.put(
      `/users/${user._id}.json` + '?auth=' + auth.state.idToken,
      user
    );

    commit('updateUser', response.data);
  },
};

const mutations = {
  // push new user to state of users
  newUser: (state, user) => state.users.push(user),

  // filter state of users for ID and remove it from storage
  removeUser: (state, _id) =>
    (state.users = state.users.filter((user) => user._id !== _id)),

  // set state of users to new value
  setUsers: (state, users) => {
    const userarray = [];
    for (let key in users) {
      const newuser = users[key];
      newuser._id = key;
      userarray.push(newuser);
    }
    state.users = userarray;
  },

  // set state of user to edit to new value
  setUserToEdit: (state, userToEdit) => (state.userToEdit = userToEdit),

  // find user in array and replace it with new one
  updateUser: (state, user) => {
    const index = state.users
      .map((e) => {
        return e._id;
      })
      .indexOf(user._id);

    state.users.splice(index, 1, user);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
