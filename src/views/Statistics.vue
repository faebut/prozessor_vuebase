<template>
  <div>
    <h1 class="grey--text">Statistik</h1>
    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs12>
          <visitor-chart :allVisits="allVisits" />
        </v-flex>
        <v-flex xs12 lg6>
          <ateliers-chart :allVisits="allVisits" :ateliers="this.ateliers" />
        </v-flex>
        <v-flex xs12 lg6></v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import VisitorChart from '@/components/statistics/VisitorChart';
import AteliersChart from '@/components/statistics/AteliersChart';

export default {
  name: 'Statistics',
  components: {
    VisitorChart,
    AteliersChart
  },
  methods: {
    ...mapActions(['fetchUsers', 'fetchAteliers'])
  },
  computed: {
    ...mapGetters(['users', 'ateliers']),
    allVisits() {
      const visitList = [];
      this.users.forEach(user => {
        if (user.visits) {
          user.visits.forEach(visit => {
            visit.user = user._id;
            visit.date = new Date(visit.date);
            visitList.push(visit);
          });
        }
      });

      return visitList;
    },
    sortUserList() {
      // remove all users without visits from list
      const userList = [];
      this.users.forEach(user => {
        if (user.visits) {
          userList.push(user);
        }
      });

      // sort List by length and return
      return userList.sort((a, b) => {
        return b.visits.length - a.visits.length;
      });
    }
  },
  created() {
    // reload state of users
    this.fetchUsers();
    this.fetchAteliers();
  }
};
</script>

<style scoped></style>
