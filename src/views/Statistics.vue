<template>
  <div>
    <h1 class="grey--text">Statistik</h1>
    <v-container class="my-5">
      <visitor-chart :visitsPerDate="visitsPerDate" />
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import VisitorChart from '@/components/statistics/VisitorChart';

export default {
  name: 'Statistics',
  components: {
    VisitorChart
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
      // seperate visits for type and count every Date
      const allDatesSeperate = {
        member: [],
        abo: [],
        daily: []
      };

      this.allVisits.forEach(visit => {
        if (visit.member == true) {
          allDatesSeperate.member.push(visit.date);
        } else if (visit.abonnement == true) {
          allDatesSeperate.abo.push(visit.date);
        } else {
          allDatesSeperate.daily.push(visit.date);
        }
      });

      function pad(n) {
        return n.toString().length == 1 ? '0' + n : n;
      }

      // count for every date
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

      // Push all dates in one array
      const allDates = [];

      this.allVisits.forEach(visit => {
        allDates.push(visit.date);
      });

      const countDates = getCount(allDates);

      // Get those keys as an array
      let keys = Object.keys(countDates);

      // Create an object with all keys set to the default value (0)
      let def = keys.reduce((result, key) => {
        result[key] = 0;
        return result;
      }, {});

      // sort function

      const sortKeys = input => {
        const output = {};
        Object.keys(input)
          .sort()
          .forEach(key => {
            output[key] = input[key];
          });
        return output;
      };

      // combine all the cases with all the dates that there where visitors and add the zero values to that case, also sort by dates

      const countDatesMember = sortKeys({
        ...def,
        ...getCount(allDatesSeperate.member)
      });
      const countDatesAbo = sortKeys({
        ...def,
        ...getCount(allDatesSeperate.abo)
      });
      const countDatesDaily = sortKeys({
        ...def,
        ...getCount(allDatesSeperate.daily)
      });

      // combine to one Object
      let allDatesCombined = {
        member: countDatesMember,
        abo: countDatesAbo,
        daily: countDatesDaily
      };

      const countDatesOrdered = sortKeys(countDates);

      return {
        dates: countDatesOrdered,
        counts: allDatesCombined
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
