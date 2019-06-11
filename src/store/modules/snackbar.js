const state = {
  // state for AlertSnackbar component
  snack: {
    message: '',
    type: '',
    timeout: 3000,
    show: false,
    icon: 'error'
  }
};

const getters = {
  // get state of snack from central storage
  snack: state => state.snack
};

const actions = {
  setSnack: ({ commit }, snack) => {
    // // set icon to type if not sucess --> not working right now
    // snack.icon = () => {
    //   if (snack.type == 'success') {
    //     return 'check_circle';
    //   }
    //   return snack.type;
    // };

    // show the Snackbar
    snack.show = true;

    // send modified object to mutations
    commit('setSnack', snack);
  }
};

const mutations = {
  // set state of snack to new value
  setSnack: (state, snack) => (state.snack = snack)
};

export default {
  state,
  getters,
  actions,
  mutations
};
