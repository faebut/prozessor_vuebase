<template>
  <div class="mt-3">
    <v-card flat class="pa-3 mb-1">
      <v-card-title>
        <h2>Nutzung Ateliers</h2>
      </v-card-title>
      <v-card-text>
        <apexcharts
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
  name: 'AteliersChart',
  components: {
    apexcharts: VueApexCharts
  },
  props: ['allVisits', 'ateliers'],
  computed: {
    visitsPerAtelier() {
      const allAteliers = [];
      this.allVisits.forEach(visit => {
        visit.ateliers.forEach(atelier => {
          allAteliers.push(atelier);
        });
      });

      // count for every atelier
      function getCount(arr) {
        const obj = {};
        for (let i = 0, l = arr.length; i < l; i++) {
          const key = arr[i];
          obj[key] = obj[key] || 0;
          obj[key]++;
        }
        return obj;
      }

      const countAteliers = getCount(allAteliers);

      Object.keys(getCount(allAteliers)).forEach(key => {
        for (let i = 0, l = this.ateliers.length; i < l; i++) {
          if (key == this.ateliers[i]._id) {
            const mem = countAteliers[key];
            delete countAteliers[key];
            countAteliers[this.ateliers[i].name] = mem;
          }
        }
      });

      return countAteliers;
    },
    chartData() {
      return {
        series: Object.values(this.visitsPerAtelier),
        chartOptions: {
          chart: {
            type: 'donut',
            animations: {
              enabled: false
            }
          },
          colors: [
            '#008FFB',
            '#00E396',
            '#FEB019',
            '#FF4560',
            '#775DD0',
            '#3F51B5',
            '#03A9F4',
            '#4CAF50',
            '#F9CE1D',
            '#FF9800'
          ],
          labels: Object.keys(this.visitsPerAtelier),
          responsive: [
            {
              breakpoint: 650,
              options: {
                legend: {
                  position: 'bottom'
                }
              }
            }
          ]
        }
      };
    }
  }
};
</script>

<style scoped></style>
