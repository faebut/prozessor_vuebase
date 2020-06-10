<template>
  <div>
    <h1 class="grey--text">Experten vor Ort</h1>
    <v-container class="my-5">
      <div v-if="loggedIn.length < 1 || !checkIfOpen" class="error--text">
        heute keine Expert*innen vor Ort!
      </div>
      <div v-else>
        <div v-for="atelier in expertsOnSite" :key="atelier.name">
          <v-icon>{{ atelier.icon }}</v-icon>
          {{ atelier.name }}
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Experts',
  methods: {
    ...mapActions(['usersLoggedIn', 'fetchAteliers'])
  },
  computed: {
    ...mapGetters(['loggedIn', 'ateliers']),
    checkIfOpen() {
      let statusOpen = false;
      const date = new Date();

      // valid week days
      const weekdays = [3, 5, 6];

      // check if open
      if (weekdays.includes(date.getDay())) {
        if (date.getDay() < 6) {
          if (12 < date.getHours() && date.getHours() < 21) {
            statusOpen = true;
          }
        } else {
          if (9 < date.getHours() && date.getHours() < 19) {
            statusOpen = true;
          }
        }
      }

      return statusOpen;
    },
    expertsOnSite() {
      const expertises = [];

      // push all atelier IDs into the array
      this.loggedIn.forEach(user => {
        if (user.expert) {
          user.expertise.forEach(atelier => {
            expertises.push(atelier);
          });
        }
      });

      // filter out all duplicates
      const expertisesFiltered = [...new Set(expertises)];

      // get the names for the ateliers
      const atelierNames = [];

      expertisesFiltered.forEach(atelierID => {
        this.ateliers.forEach(atelier => {
          if (atelier._id == atelierID) {
            atelierNames.push({
              name: atelier.name,
              icon: atelier.icon
            });
          }
        });
      });

      return atelierNames;
    }
  },
  created() {
    // reloat state of users logged in
    this.usersLoggedIn();

    // get the ateliers to pass them down
    this.fetchAteliers();
  }
};
</script>

<style scoped></style>
