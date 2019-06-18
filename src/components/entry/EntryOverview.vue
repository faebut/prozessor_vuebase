<template>
  <div>
    <h2>Eingecheckt</h2>
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
