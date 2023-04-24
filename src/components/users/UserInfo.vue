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
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>

          <h2 class="primary--text mt-4">Lade Benutzer*in...</h2>
        </v-flex>

        <v-form ref="form" v-if="!fetching">
          <v-layout row wrap>
            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Adresse</div>
              <div>{{ user.firstname }} {{ user.name }}</div>
              <div>
                <br />
              </div>
              <div v-if="user.address !== ''">{{ user.address }}</div>
              <div>{{ user.postcode }} {{ user.city }}</div>
            </v-flex>

            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Geburtstag</div>
              <div>{{ computedDateBirthdate }}</div>
              <div>
                <br />
              </div>
              <div class="caption grey--text">Kontakt</div>
              <div>{{ user.email }}</div>
              <div>{{ user.phone }}</div>
            </v-flex>
            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Jahresabonnement</div>
              <div v-if="validAbo === 'ja'">
                gültig bis: {{ computedDateEnddate }}
              </div>
              <div v-if="validAbo === 'nein'" class="error--text">
                abgelaufen am: {{ computedDateEnddate }}
              </div>
              <div v-if="validAbo === 'kein'">Kein Abonnement</div>
              <div>
                <br />
              </div>
              <div v-if="user.member">
                <div class="caption grey--text">Betriebsgruppe Prozessor</div>
                <div>Betriebsgruppe Verein Prozessor</div>
              </div>
              <br />
              <div v-if="user.helper">
                <div class="caption grey--text">Helfer*in</div>
                <div>Helfer*in Verein Prozessor</div>
              </div>
            </v-flex>

            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Partnerschaften</div>
              <div v-if="user.partners">
                <v-chip v-for="partner in computedPartners" :key="partner">
                  {{ partner }}
                </v-chip>
              </div>
              <div v-else>Keine Partnerschaften</div>
            </v-flex>

            <v-flex xs12 class="px-2 mt-4">
              <h2>Weitere Infos</h2>
            </v-flex>

            <v-flex xs12 sm6 class="px-2">
              <div class="caption grey--text">Nutzungsvereinbarung</div>
              <div>
                <span class="success--text" v-if="user.agreement === true"
                  >Nutzungsvereinbarung unterschrieben</span
                >
                <span v-else class="error--text"
                  >Nutzungsvereinbarung nicht unterschrieben</span
                >
              </div>
              <br />
            </v-flex>

            <v-flex xs12 sm6 class="px-2">
              <div class="caption grey--text">Infos</div>
              <div>
                <span v-if="user.infos">{{ user.infos }}</span>
                <span v-else>keine speziellen Informationen</span>
              </div>
            </v-flex>

            <v-flex v-if="user.expert" xs12 class="px-2">
              <div class="caption grey--text">Expertise</div>
              <div v-if="user.expertise">
                <v-chip v-for="atelier in computedExpertise" :key="atelier">
                  {{ atelier }}
                </v-chip>
              </div>
            </v-flex>

            <v-flex xs12 class="px-2 mt-4">
              <h2>Statistik</h2>
            </v-flex>

            <v-flex xs12 class="px-2">
              <div>
                Anzahl Besuche:
                <span v-if="user.visits">{{ user.visits.length }}</span>
                <span v-else>noch keine Besuche</span>
              </div>
            </v-flex>

            <v-flex xs12 class="mt-4 px-2">
              <v-btn block color="error" dark @click="onCancel"
                >Schliessen</v-btn
              >
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
  name: 'UserInfo',
  props: ['id'],
  data: () => ({
    dialog: false,
    fetching: true,
    user: {},
  }),
  methods: {
    ...mapActions(['fetchPartners', 'fetchSingleUser', 'fetchAteliers']),

    // fetch user after pressing Info button
    openInfo(e) {
      e.preventDefault();

      // make sure the loading spinner ist showing and dialog fires up
      this.fetching = true;

      // fetch single User
      this.fetchSingleUser(this.id)
        .then((res) => {
          // get the data and set it to the user
          this.user = res.response.data;

          // remove the loader and show form
          this.fetching = false;
        })
        .catch((err) => {
          // show snackbar for error
          this.setSnack({
            message: `Error: ${err}`,
            type: 'error',
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
    },
  },
  computed: {
    ...mapGetters(['partners', 'ateliers']),

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
    validAbo() {
      // format the end date
      const datestring = new Date(this.user.buydate);

      const enddate = new Date(
        datestring.setFullYear(datestring.getFullYear() + 1)
      );

      // check if still valid or not or not existent
      let valid = 'kein';
      if (Math.sign(new Date() - new Date(enddate)) === 1) {
        valid = 'nein';
      } else if (Math.sign(new Date() - new Date(enddate)) === -1) {
        valid = 'ja';
      } else {
        valid = 'kein';
      }

      return valid;
    },
    computedPartners() {
      const partnerNames = [];

      this.user.partners.forEach((partnerID) => {
        const partnerName = this.partners.find(
          (p) => p._id === partnerID
        ).partner;

        partnerNames.push(partnerName);
      });

      return partnerNames;
    },
    computedExpertise() {
      const atelierNames = [];

      this.user.expertise.forEach((atelierID) => {
        const atelierName = this.ateliers.find((p) => p._id === atelierID).name;

        atelierNames.push(atelierName);
      });

      return atelierNames;
    },
  },
  created() {
    // reload state of partners
    this.fetchPartners();
    // reload state of ateliers
    this.fetchAteliers();
  },
};
</script>

<style></style>
