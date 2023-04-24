<template>
  <div class="mt-3">
    <v-card flat class="pa-3 mb-1">
      <v-card-title>
        <h2>Statistik</h2>
      </v-card-title>
      <v-card-text>
        <v-layout>
          <v-flex md6 sm12 class="px-2">
            Registrierte Besuchende: {{ users.length }}
          </v-flex>

          <v-flex md6 sm12 class="px-2">
            Besuche im Zeitraum:
            <br /><br />
            Tagesnutzungen: {{ countDates.daily }}<br />
            Abonnements: {{ countDates.abo }}<br />
            Helfende: {{ countDates.helper }}<br />
            Betriebsgruppe: {{ countDates.member }}<br />
            Total: {{ countDates.total }}
          </v-flex>

          <v-flex md6 sm12 class="px-2">
            Altersgruppen:
            <br /><br />
            U 18: {{ countAges.u18.toFixed(1) }} %<br />
            18 – 30: {{ countAges.u31.toFixed(1) }} %<br />
            31 – 50: {{ countAges.u51.toFixed(1) }} %<br />
            51 - 65: {{ countAges.u66.toFixed(1) }} %<br />
            65+: {{ countAges.u100.toFixed(1) }} %
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'OptionsStatistic',
  props: ['allVisits', 'visitsPerDate'],

  methods: {
    clickbait() {
      console.log(this.allVisits);
    },
  },
  computed: {
    ...mapGetters(['users']),

    countDates() {
      const total = this.allVisits.length;
      let abo = 0;
      let daily = 0;
      let helper = 0;
      let member = 0;

      this.allVisits.forEach((visit) => {
        if (visit.helper == true) {
          helper += 1;
        } else if (visit.member == true) {
          member += 1;
        } else if (visit.abonnement == true) {
          abo += 1;
        } else {
          daily += 1;
        }
      });

      return {
        total,
        abo,
        daily,
        helper,
        member,
      };
    },
    countAges() {
      let u18 = 0;
      let u31 = 0;
      let u51 = 0;
      let u66 = 0;
      let u100 = 0;

      // convert all the birthdates to numbers and push on array
      const userages = [];

      for (let i = 0; i < this.users.length; i++) {
        const today = new Date();
        const birthDate = new Date(this.users[i].birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        userages.push(age);
      }

      // use all ages and count them.

      for (let i = 0; i < userages.length; i++) {
        if (userages[i] < 18) {
          u18 += 1;
        } else if (userages[i] < 31) {
          u31 += 1;
        } else if (userages[i] < 51) {
          u51 += 1;
        } else if (userages[i] < 66) {
          u66 += 1;
        } else {
          u100 += 1;
        }
      }

      u18 = (u18 / this.users.length) * 100;
      u31 = (u31 / this.users.length) * 100;
      u51 = (u51 / this.users.length) * 100;
      u66 = (u66 / this.users.length) * 100;
      u100 = (u100 / this.users.length) * 100;

      return {
        u18,
        u31,
        u51,
        u66,
        u100,
      };
    },
  },
};
</script>

<style scoped></style>
