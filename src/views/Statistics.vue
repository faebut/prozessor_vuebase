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
        <h2>Charts</h2>
        <div>
          <apexcharts
            width="500"
            type="bar"
            :options="chartData.chartOptions"
            :series="chartData.series"
          ></apexcharts>
        </div>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'Statistics',
  components: {
    apexcharts: VueApexCharts
  },
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
    },
    chartData() {
      return {
        chartOptions: {
          chart: {
            id: 'Besuche nach Datum',
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
              show: true
            }
          },
          xaxis: {
            type: 'datetime',
            categories: [
              '01/01/2011 GMT',
              '01/02/2011 GMT',
              '01/03/2011 GMT',
              '01/04/2011 GMT',
              '01/05/2011 GMT',
              '01/06/2011 GMT'
            ]
          }
        },
        series: [
          {
            name: 'Mitglieder',
            data: [44, 55, 41, 67, 0, 43]
          },
          {
            name: 'Tagesnutzung',
            data: [13, 23, 0, 8, 13, 27]
          },
          {
            name: 'Jahresabo',
            data: [11, 17, 15, 15, 21, 14]
          }
        ]
      };
    }
  },
  created() {
    // reload state of users
    this.fetchUsers();
  }
};
</script>

<style scoped></style>
