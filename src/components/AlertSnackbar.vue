<template>
  <v-snackbar
    v-model="snack.show"
    :color="snack.type"
    :timeout="snack.timeout"
    top
  >
    <v-icon left dark>error</v-icon>

    <b>{{ snack.message }}</b>

    <v-btn dark flat @click="hideSnack">schliessen</v-btn>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'AlertSnackbar',
  methods: {
    ...mapActions(['hideSnack']),
  },
  computed: {
    ...mapGetters(['snack']),
  },
};
</script>

<style></style>
