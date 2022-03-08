<template>
  <div>
    <h1 class="grey--text">Statistik</h1>
    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card flat class="pa-3 mb-1">
            <v-card-title>
              <h2>Statistik filtern</h2>
            </v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-layout wrap>
                  <v-flex md6 sm12 class="px-2">
                    <v-menu
                      v-model="datePickerStartdate"
                      :close-on-content-click="false"
                      full-width
                      max-width="290"
                    >
                      <template #activator="{ on }">
                        <v-text-field
                          :value="computedDateStartdate"
                          clearable
                          label="Datum Start"
                          prepend-icon="calendar_month"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="startDate"
                        locale="de"
                        color="primary"
                        @change="datePickerStartdate = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>

                  <v-flex md6 sm12 class="px-2">
                    <v-menu
                      v-model="datePickerEnddate"
                      :close-on-content-click="false"
                      full-width
                      max-width="290"
                    >
                      <template #activator="{ on }">
                        <v-text-field
                          :value="computedDateEnddate"
                          clearable
                          label="Datum Start"
                          prepend-icon="calendar_month"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="endDate"
                        locale="de"
                        color="primary"
                        @change="datePickerEnddate = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12>
          <options-statistic
            :all-visits="allVisits"
            :visits-per-date="visitsPerDate"
          />
        </v-flex>
        <v-flex xs12>
          <visitor-chart
            :all-visits="allVisits"
            :visits-per-date="visitsPerDate"
          />
        </v-flex>
        <v-flex xs12 lg6>
          <ateliers-chart :all-visits="allVisits" :ateliers="ateliers" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import format from 'date-fns/format';
import locales from 'date-fns/locale/de';
import OptionsStatistic from '@/components/statistics/OptionsStatistic';
import VisitorChart from '@/components/statistics/VisitorChart';
import AteliersChart from '@/components/statistics/AteliersChart';

export default {
  name: 'StatisticsMain',
  components: {
    OptionsStatistic,
    VisitorChart,
    AteliersChart
  },
  data() {
    return {
      // form fields
      startDate: '2019-01-01',
      endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      // date Stuff
      datePickerStartdate: false,
      datePickerEnddate: false
    };
  },
  methods: {
    ...mapActions(['fetchUsers', 'fetchAteliers'])
  },
  computed: {
    ...mapGetters(['users', 'ateliers']),
    // Format the StartDate
    computedDateStartdate() {
      return this.startDate
        ? format(this.startDate, 'DD. MMMM YYYY', { locale: locales })
        : '';
    },
    // Format the EndDate
    computedDateEnddate() {
      return this.endDate
        ? format(this.endDate, 'DD. MMMM YYYY', { locale: locales })
        : '';
    },
    allVisits() {
      const visitList = [];
      this.users.forEach(user => {
        if (user.visits) {
          user.visits.forEach(visit => {
            if (
              new Date(visit.date) >= new Date(this.startDate) &&
              new Date(visit.date) <= new Date(this.endDate)
            ) {
              visit.user = user._id;
              visit.date = new Date(visit.date);
              visitList.push(visit);
            }
          });
        }
      });

      return visitList;
    },
    visitsPerDate() {
      // seperate visits for type and count every Date
      const allDatesSeperate = {
        member: [],
        helper: [],
        abo: [],
        daily: []
      };

      this.allVisits.forEach(visit => {
        if (visit.helper == true) {
          allDatesSeperate.helper.push(visit.date);
        } else if (visit.member == true) {
          allDatesSeperate.member.push(visit.date);
        } else if (visit.abonnement == true) {
          allDatesSeperate.abo.push(visit.date);
        } else {
          allDatesSeperate.daily.push(visit.date);
        }
      });

      function pad(n) {
        return n.toString().length == 1 ? `0${n}` : n;
      }

      // count for every date
      function getCount(arr) {
        const obj = {};
        for (let i = 0, l = arr.length; i < l; i++) {
          const thisDate = arr[i];
          const day = pad(thisDate.getDate());
          const month = pad(thisDate.getMonth() + 1);
          const year = thisDate.getFullYear();
          const key = [year, month, day].join('-');
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
      const keys = Object.keys(countDates);

      // Create an object with all keys set to the default value (0)
      const def = keys.reduce((result, key) => {
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
      const countDatesHelper = sortKeys({
        ...def,
        ...getCount(allDatesSeperate.helper)
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
      const allDatesCombined = {
        member: countDatesMember,
        helper: countDatesHelper,
        abo: countDatesAbo,
        daily: countDatesDaily
      };

      const countDatesOrdered = sortKeys(countDates);

      return {
        dates: countDatesOrdered,
        counts: allDatesCombined
      };
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
      return userList.sort((a, b) => b.visits.length - a.visits.length);
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
