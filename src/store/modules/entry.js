import axios from 'axios';

const actions = {
  // add a entry to the user to the database and set value for mutation
  // eslint-disable-next-line no-empty-pattern
  async addEntry({ }, user) {
    const response = await axios.put(
      `/users/${user._id}/visits.json`,
      user.visits
    );
    return response.data;
  }
};

export default {
  actions
};
