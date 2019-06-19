<template>
  <div>
    <h2 class="mb-2">Eingecheckt</h2>
    <div class="mb-1 caption grey--text">Legende</div>
    <div class="mb-3">
      <v-icon>person</v-icon>&nbsp;kein Mitglied,&nbsp;
      <v-icon class="success--text">person</v-icon>&nbsp;Mitglied,&nbsp;
      <v-icon class="success--text">group</v-icon>&nbsp;Partner*in,&nbsp;
      <v-icon class="success--text">verified_user</v-icon>&nbsp;Abonnement
    </div>
    <div v-if="loggedIn.length < 1" class="error--text">heute noch keine Besuche erfasst!</div>
    <entry-logged-in-user
      v-for="user in sortedUsers"
      :key="user._id"
      :user="user"
      :visit="user.visits[user.visits.length - 1]"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import EntryLoggedInUser from '@/components/entry/EntryLoggedInUser';

export default {
  name: 'EntryOverview',
  components: {
    EntryLoggedInUser
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['usersLoggedIn'])
  },
  computed: {
    ...mapGetters(['loggedIn']),
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
  }
};
</script>

<style scoped></style>
