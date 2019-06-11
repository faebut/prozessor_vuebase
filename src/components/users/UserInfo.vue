<template>
  <v-dialog max-width="800px" v-model="dialog">
    <!-- button -->
    <v-btn fab small color="info" @click="openInfo" slot="activator">
      <v-icon>info</v-icon>
    </v-btn>

    <!-- form -->
    <v-card>
      <v-card-title v-if="!fetching" class="px-4">
        <h1>Informationen zu {{ user.firstname }} {{ user.name }}</h1>
      </v-card-title>
      <v-card-text>
        <v-flex xs12 class="text-xs-center mb-5 mt-5 pt-5 pb-5" v-if="fetching">
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>

          <h2 class="primary--text mt-4">Lade Benutzer*in...</h2>
        </v-flex>

        <v-form ref="form" v-if="!fetching">
          <v-layout row wrap>
            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Adresse</div>
              <div>{{ user.firstname }} {{ user.name }}</div>
              <div>
                <br>
              </div>
              <div v-if="user.address !== ''">{{ user.address }}</div>
              <div>{{ user.postcode }} {{ user.city }}</div>
            </v-flex>

            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Geburtstag</div>
              <div>{{ computedDateBirthdate }}</div>
              <div>
                <br>
              </div>
              <div class="caption grey--text">Kontakt</div>
              <div>{{ user.email }}</div>
              <div>{{ user.phone }}</div>
            </v-flex>
            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Jahresabonnement</div>
              <div v-if="user.buydate === null">Kein Abonnement</div>
              <div v-else>gültig bis: {{ computedDateEnddate }}</div>
              <div>
                <br>
              </div>
              <div v-if="user.member">
                <div class="caption grey--text" v-if="user.member">Mitglied Prozessor</div>
                <div>Mitglied Verein Prozessor</div>
              </div>
            </v-flex>

            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Partnerschaften</div>
              <div v-if="user.partners === []">Keine Partnerschaft</div>
              <div v-else>
                <v-chip v-for="partner in computedPartners" :key="partner">{{ partner }}</v-chip>
              </div>
            </v-flex>

            <v-flex xs12 class="px-2 mt-4">
              <h2>Statistik</h2>
            </v-flex>

            <v-flex xs6 sm6 md4 class="px-2">
              <div>Anzahl Besuche: {{ user.visits.length }}</div>
            </v-flex>

            <v-flex xs12 class="mt-4 px-2">
              <v-btn block color="error" dark @click="onCancel">Schliessen</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import format from 'date-fns/format';
import locales from 'date-fns/locale/de';

export default {
  name: 'UserEdit',
  props: ['id'],
  data: () => ({
    dialog: false,
    fetching: true,
    user: {}
  }),
  methods: {
    ...mapActions(['fetchPartners', 'fetchSingleUser']),

    // fetch user after pressing Info button
    openInfo(e) {
      e.preventDefault();

      // make sure the loading spinner ist showing and dialog fires up
      this.fetching = true;

      // fetch single User
      this.fetchSingleUser(this.id)
        .then(res => {
          // get the data and set it to the user
          this.user = res.response.data;

          // remove the loader and show form
          this.fetching = false;

          // feedback for successfull loading
        })
        .catch(err => {
          // show snackbar for error
          this.setSnack({
            message: `Error: ${err}`,
            type: 'error'
          });
        });
    },

    // on clicking the cancel button in the form
    onCancel(e) {
      e.preventDefault();

      // // reset the userToEdit in storage --> Check if needed
      // this.clearUserToEdit();

      // close dialog
      this.dialog = false;
    }
  },
  computed: {
    ...mapGetters(['partners']),

    // Format the Birthdate
    computedDateBirthdate() {
      return this.user.birthdate
        ? format(this.user.birthdate, 'DD. MMMM YYYY', { locale: locales })
        : '';
    },

    // Format the end date
    computedDateEnddate() {
      const datestring = new Date(this.user.buydate);

      const enddate = new Date(
        datestring.setFullYear(datestring.getFullYear() + 1)
      );

      return enddate
        ? format(enddate, 'DD. MMMM YYYY', { locale: locales })
        : '';
    },
    computedPartners() {
      const partnerNames = [];

      this.user.partners.forEach(partnerID => {
        const partnerName = this.partners.find(p => p._id === partnerID)
          .partner;

        partnerNames.push(partnerName);
      });

      return partnerNames;
    }
  },
  created() {
    // reload state of partners
    this.fetchPartners();
  }
};
</script>

<style></style>
