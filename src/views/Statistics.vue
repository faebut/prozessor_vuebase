<template>
  <v-container>
    <v-layout>
      <h1>Statistik</h1>
      <v-container class="my-5">
        <h2>Rangliste:</h2>
        <ul v-for="user in sortUserList" :key="user._id">
          <li>
            {{ user.firstname }} {{ user.name }} :
            {{ user.visits.length }} visits
          </li>
        </ul>
        <div>Total Besuche: {{ allVisits.length }}</div>
        <h2>Besuche nach Daten:</h2>
        <ul v-for="(date, index) in visitsPerDate" :key="index">
          <li>{{ index }} : {{ date }}</li>
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
    // visitsByDate() {

    //   // complicated way to rearrange visitDates in a complex Object
    //   const visitsDate = {};

    //   for (let y = 2019; y < 2030; y++) {
    //     this.allVisits.forEach(visit => {
    //       if (visit.date.getFullYear() == y) {
    //         if (visitsDate[y]) {
    //           for (let m = 0; m < 12; m++) {
    //             if (visit.date.getMonth() == m) {
    //               if (visitsDate[y][m]) {
    //                 for (let d = 0; d < 30; d++) {
    //                   if (visit.date.getDate() == d) {
    //                     if (visitsDate[y][m][d]) {
    //                       visitsDate[y][m][d].push(visit);
    //                     } else {
    //                       visitsDate[y][m][d] = [];
    //                       visitsDate[y][m][d].push(visit);
    //                     }
    //                   }
    //                 }
    //               } else {
    //                 visitsDate[y][m] = {};
    //                 for (let d = 0; d < 32; d++) {
    //                   if (visit.date.getDate() == d) {
    //                     if (visitsDate[y][m][d]) {
    //                       visitsDate[y][m][d].push(visit);
    //                     } else {
    //                       visitsDate[y][m][d] = [];
    //                       visitsDate[y][m][d].push(visit);
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         } else {
    //           visitsDate[y] = {};
    //           for (let m = 0; m < 12; m++) {
    //             if (visit.date.getMonth() == m) {
    //               if (visitsDate[y][m]) {
    //                 for (let d = 0; d < 30; d++) {
    //                   if (visit.date.getDate() == d) {
    //                     if (visitsDate[y][m][d]) {
    //                       visitsDate[y][m][d].push(visit);
    //                     } else {
    //                       visitsDate[y][m][d] = [];
    //                       visitsDate[y][m][d].push(visit);
    //                     }
    //                   }
    //                 }
    //               } else {
    //                 visitsDate[y][m] = {};
    //                 for (let d = 0; d < 30; d++) {
    //                   if (visit.date.getDate() == d) {
    //                     if (visitsDate[y][m][d]) {
    //                       visitsDate[y][m][d].push(visit);
    //                     } else {
    //                       visitsDate[y][m][d] = [];
    //                       visitsDate[y][m][d].push(visit);
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     });
    //   }
    //   return visitsDate;
    // },
    visitsPerDate() {
      let allDates = [];

      this.allVisits.forEach(visit => {
        allDates.push(visit.date);
      });

      function pad(n) {
        return n.toString().length == 1 ? '0' + n : n;
      }

      function getCount(arr) {
        var obj = {};
        for (var i = 0, l = arr.length; i < l; i++) {
          var thisDate = arr[i];
          var day = pad(thisDate.getDate());
          var month = pad(thisDate.getMonth() + 1);
          var year = thisDate.getFullYear();
          var key = [year, month, day].join('-');
          obj[key] = obj[key] || 0;
          obj[key]++;
        }
        return obj;
      }

      const countDates = getCount(allDates);

      const countDatesOrdered = {};
      Object.keys(countDates)
        .sort()
        .forEach(function(key) {
          countDatesOrdered[key] = countDates[key];
        });

      return countDatesOrdered;
    }
  },
  created() {
    // reload state of users
    this.fetchUsers();
  }
};
</script>

<style scoped></style>
