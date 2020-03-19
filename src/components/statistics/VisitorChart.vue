<template>
  <div class="mt-3">
    <v-card flat class="pa-3 mb-1">
      <v-card-title>
        <h2>Benutzende nach Datum</h2>
      </v-card-title>
      <v-card-text>
        <apexcharts
          type="bar"
          :options="chartData.chartOptions"
          :series="chartData.series"
        ></apexcharts>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'VisitorChart',
  props: ['allVisits'],
  components: {
    apexcharts: VueApexCharts
  },
  computed: {
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
            categories: Object.keys(this.visitsPerDate.dates)
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left'
          },
          responsive: [
            {
              breakpoint: 600,
              options: {
                legend: {
                  position: 'bottom',
                  horizontalAlign: 'center',
                  containerMargin: {
                    top: 65,
                    bottom: 35
                  }
                }
              }
            }
          ]
        },
        series: [
          {
            name: 'Mitglieder',
            data: Object.values(this.visitsPerDate.counts.member)
          },
          {
            name: 'Jahresabo',
            data: Object.values(this.visitsPerDate.counts.abo)
          },
          {
            name: 'Tagesnutzung',
            data: Object.values(this.visitsPerDate.counts.daily)
          }
        ]
      };
    }
  }
};
</script>

<style scoped></style>
