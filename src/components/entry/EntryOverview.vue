<template>
  <div>
    <h2 class="mb-2">Eingecheckt am {{ date }}</h2>
    <div v-if="loggedIn.length < 1" class="error--text">heute noch keine Besuche erfasst!</div>
    <entry-logged-in-user
      v-for="user in sortedUsers"
      :key="user._id"
      :user="user"
      :visit="user.visits[user.visits.length - 1]"
      :ateliers="ateliers"
    />

    <v-card v-if="loggedIn.length > 0" flat class="pa-3 mb-1">
      <v-layout row wrap>
        <v-flex xs12 class="mb-3">
          <h2>Legende</h2>
        </v-flex>

        <v-flex xs4>
          <div class="mb-1 caption grey--text">Tarif</div>
          <v-icon>person</v-icon>&nbsp;kein Mitglied
          <br>
          <v-icon class="success--text">person</v-icon>&nbsp;Mitglied
          <br>
          <v-icon class="success--text">group</v-icon>&nbsp;Partner*in
          <br>
          <v-icon class="success--text">verified_user</v-icon>&nbsp;Abonnement
        </v-flex>

        <v-flex xs8>
          <div class="mb-1 caption grey--text">Werkstätten</div>
          <div v-for="atelier in ateliers" :key="atelier.name">
            <v-icon>{{ atelier.icon }}</v-icon>
            &nbsp;
            {{ atelier.name }}
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import EntryLoggedInUser from '@/components/entry/EntryLoggedInUser';

export default {
  name: 'EntryOverview',
  props: ['date'],
  components: {
    EntryLoggedInUser
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['usersLoggedIn', 'fetchAteliers'])
  },
  computed: {
    ...mapGetters(['loggedIn', 'ateliers']),
    sortedUsers() {
      const sortedUsers = this.loggedIn
        .slice()
        .sort((a, b) =>
          a.firstname.toLowerCase() > b.firstname.toLowerCase()
            ? 1
            : a.firstname.toLowerCase() === b.firstname.toLowerCase()
            ? a.name.toLowerCase() > b.name.toLowerCase()
              ? 1
              : -1
            : -1
        );
      return sortedUsers;
    }
  },
  created() {
    // reloat state of users logged in
    this.usersLoggedIn();

    // get the ateliers to pass them down
    this.fetchAteliers();
  }
};
</script>

<style scoped></style>
