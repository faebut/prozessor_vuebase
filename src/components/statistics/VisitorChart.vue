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
  props: ['visitsPerDate'],
  components: {
    apexcharts: VueApexCharts
  },
  computed: {
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
          }
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
