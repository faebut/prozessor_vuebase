<template>
  <v-container>
    <v-layout>
      <h1>Statistik</h1>
      <v-container class="my-5">
        <h2>Rangliste:</h2>
        <ul v-for="user in sortUserList" :key="user._id">
          <li>{{ user.firstname }} {{ user.name }} : {{ user.visits.length }} visits</li>
        </ul>
        <div>Total Besuche: {{ allVisits.length }}</div>

        <h2>Sortierte Besuche</h2>
        <ul v-for="(visit, index) in visitsByDate" :key="index">
          <li>{{ visit }}</li>
        </ul>
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
    },
    visitsByDate() {
      const visitsDate = [];

      for (let i = 0; i < 12; i++) {
        this.allVisits.forEach(visit => {
          if (visit.date.getMonth() == i) {
            if (visitsDate.includes(i)) {
              return;
            } else {
              visitsDate.push(i);
            }
          }
        });
      }

      console.log(visitsDate);

      return visitsDate;
    }
  },
  created() {
    // reload state of users
    this.fetchUsers();
  }
};
</script>

<style scoped></style>
