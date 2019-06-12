.<template>
  <v-dialog max-width="800px" persistent v-model="dialog">
    <!-- button -->
    <v-icon class="success--text" @click="openNew" slot="activator"
      >exit_to_app</v-icon
    >

    <!-- form -->
    <v-card>
      <v-card-title v-if="!fetching" class="px-4">
        <h1>{{ user.firstname }} {{ user.name }} einchecken</h1>
      </v-card-title>
      <v-card-text>
        <v-flex xs12 class="text-xs-center mb-5 mt-5 pt-5 pb-5" v-if="fetching">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>

          <h2 class="primary--text mt-4">Lade Besucher*in...</h2>
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
              <div v-if="user.buydate === null">Kein Abonnement</div>
              <div v-else>gültig bis: {{ computedDateEnddate }}</div>
              <div>
                <br />
              </div>
              <div v-if="user.member">
                <div class="caption grey--text" v-if="user.member">
                  Mitglied Prozessor
                </div>
                <div>Mitglied Verein Prozessor</div>
              </div>
            </v-flex>

            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Partnerschaften</div>
              <div v-if="user.partners === []">Keine Partnerschaft</div>
              <div v-else>
                <v-chip v-for="partner in computedPartners" :key="partner">{{
                  partner
                }}</v-chip>
              </div>
            </v-flex>

            <v-flex xs12 class="px-2 mt-4">
              <h2>Statistik</h2>
            </v-flex>

            <v-flex xs6 sm6 md4 class="px-2">
              <div>Anzahl Besuche: {{ user.visits.length }}</div>
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
  name: 'EntryNew',
  props: ['id'],
  data: () => {
    return {
      loading: false,
      dialog: false,
      valid: false,
      fetching: true,
      // rules
      rules: {
        required: value => !!value || 'Bitte eingeben.'
      },
      // date Stuff
      datePickerBirthday: false,
      datePickerBuydate: false,

      // form fields initally empty --> check if needed
      user: {}
    };
  },
  methods: {
    ...mapActions(['fetchPartners', 'fetchSingleUser', 'editUser', 'setSnack']),

    // on clicking the send button in the form
    onSubmit(e) {
      e.preventDefault();

      // check if the input is valid
      if (this.$refs.form.validate()) {
        // set the button to spin
        this.loading = true;
        // call action to add new user
        this.editUser(this.user)
          .then(() => {
            // remove spinner
            this.loading = false;
            // show snackbar for success
            this.setSnack({
              message: `Besucher*in ${this.user.firstname} ${
                this.user.name
              } erfolgreich eingecheckt`,
              type: 'success'
            });
            // close dialog
            this.dialog = false;
          })
          .catch(err => {
            // show snackbar for error
            this.setSnack({
              message: `Error: ${err}`,
              type: 'error'
            });
          });
      }
    },

    opeNew(e) {
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

    // Format the Buydate
    computedDateBuydate() {
      return this.user.buydate
        ? format(this.user.buydate, 'DD. MMMM YYYY', { locale: locales })
        : '';
    }
  },
  created() {
    // reload state of partners
    this.fetchPartners();
  }
};
</script>

<style scoped></style>
