<template>
  <v-container>
    <v-layout>
      <h1>Statistik</h1>
      <v-container class="my-5">
        <ul v-for="user in users" :key="user._id">
          <li v-if="user.visits">
            {{ user.firstname }} : {{ user.visits.length }} visits
          </li>
        </ul>
        <div>Total: {{ allVisits.length }}</div>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Statistics',
  methods: {
    ...mapActions(['fetchUsers'])
  },
  computed: {
    ...mapGetters(['users']),
    allVisits() {
      const visitlist = [];
      this.users.forEach(user => {
        if (user.visits) {
          const userid = user._id;
          user.visits.forEach(visit => {
            visitlist.push({
              user: userid,
              abonnement: visit.abonnement,
              ateliers: visit.ateliers,
              date: visit.date,
              member: visit.member,
              partner: visit.partner,
              price: visit.price
            });
          });
        }
      });
      // console.log(visitlist);
      //passthrough, not really needed.
      return visitlist;
    }
  },
  created() {
    // reload state of users
    this.fetchUsers();
  }
};
</script>

<style scoped></style>
