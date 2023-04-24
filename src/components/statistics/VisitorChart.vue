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
          height="400"
        ></apexcharts>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'VisitorChart',
  components: {
    apexcharts: VueApexCharts,
  },
  props: ['allVisits', 'visitsPerDate'],
  computed: {
    chartData() {
      return {
        chartOptions: {
          chart: {
            id: 'Besuche nach Datum',
            type: 'bar',
            stacked: true,
            animations: {
              enabled: false,
            },
            toolbar: {
              show: true,
            },
          },
          xaxis: {
            type: 'datetime',
            categories: Object.keys(this.visitsPerDate.dates),
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
          },
          dataLabels: {
            enabled: false,
          },
          makers: {
            size: 0,
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
                    bottom: 35,
                  },
                },
              },
            },
          ],
        },
        series: [
          {
            name: 'Betriebsgruppe',
            data: Object.values(this.visitsPerDate.counts.member),
          },
          {
            name: 'Helfende',
            data: Object.values(this.visitsPerDate.counts.helper),
          },
          {
            name: 'Jahresabo',
            data: Object.values(this.visitsPerDate.counts.abo),
          },
          {
            name: 'Tagesnutzung',
            data: Object.values(this.visitsPerDate.counts.daily),
          },
        ],
      };
    },
  },
};
</script>

<style scoped></style>
