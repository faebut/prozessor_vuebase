.<template>
  <v-dialog max-width="800px" persistent v-model="dialog">
    <!-- button -->
    <v-icon class="success--text" @click="openNew" slot="activator">exit_to_app</v-icon>

    <!-- form -->
    <v-card>
      <v-card-title v-if="!fetching" class="px-4">
        <h1>{{ user.firstname }} {{ user.name }} einchecken</h1>
      </v-card-title>
      <v-card-text>
        <v-flex xs12 class="text-xs-center mb-5 mt-5 pt-5 pb-5" v-if="fetching">
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>

          <h2 class="primary--text mt-4">Lade Besucher*in...</h2>
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
              <div v-if="user.buydate">gültig bis: {{ computedDateEnddate }}</div>
              <div v-else>Kein Abonnement</div>
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
              <div v-if="user.partners">
                <v-chip v-for="partner in computedPartners" :key="partner">
                  {{
                  partner
                  }}
                </v-chip>
              </div>
              <div v-else>Keine Partnerschaften</div>
              <div class="text-xs-right pr-2 pt-3">
                <user-edit :id="user._id"/>
              </div>
            </v-flex>

            <v-flex xs12 class="px-2 mt-4 mb-3">
              <h2>Einchecken</h2>
            </v-flex>

            <v-flex v-if="user.member" xs6 class="px-2">
              <div class="caption grey--text">Mitglied</div>
              <div>
                <v-switch v-model="asmember" label="als Mitglied einchecken"></v-switch>
              </div>
            </v-flex>

            <v-flex v-if="user.partners" xs6 class="px-2">
              <div class="caption grey--text">als Partner_in Einchecken</div>

              <div>
                <v-select
                  :items="computedPartnersSelect"
                  item-value="id"
                  item-text="name"
                  v-model="aspartner"
                ></v-select>
              </div>
            </v-flex>

            <v-flex xs12 class="px-2">
              <div class="caption grey--text">Werkstätten</div>
              <div>
                <v-select
                  v-model="asatelier"
                  :items="ateliers"
                  hide-selected
                  deletable-chips
                  attach
                  chips
                  label="Ateliers/Werkstätten auswählen"
                  multiple
                ></v-select>
              </div>
            </v-flex>

            <v-flex xs6 class="px-2">
              <div class="caption grey--text">Altersklasse</div>
              <div>
                <span v-if="userage < 12">Kinder unter 12 Jahren</span>
                <span v-if="userage < 18">Jugendliche unter 18 Jahren</span>
                <span v-else>Erwachsene</span>
              </div>
            </v-flex>

            <v-flex xs6 class="px-2">
              <div class="caption grey--text">Eintrittspreis</div>
              <div>CHF {{ computedPrice }}.-</div>
            </v-flex>

            <v-flex xs6 class="mt-4 px-2">
              <v-btn color="success" dark @click="onSubmit">Einchecken</v-btn>
              <v-btn color="error" dark @click="onCancel">Abbrechen</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import UserEdit from '../users/UserEdit';
import format from 'date-fns/format';
import locales from 'date-fns/locale/de';

export default {
  name: 'EntryNew',
  components: {
    UserEdit
  },
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
      user: {},

      // age of user
      userage: 0,

      // checked in as member
      asmember: false,

      // checked in as partner
      aspartner: 'no_id',

      // ateliers
      ateliers: [
        'Holzwerkstatt',
        'Metallwerkstatt',
        'Fotolabor',
        'Druckatelier',
        'Foodatelier',
        'Textilatelier',
        'Studio',
        'Fablab'
      ],

      // checked in ateliers
      asatelier: []
    };
  },
  methods: {
    ...mapActions(['fetchSingleUser', 'addEntry', 'setSnack']),

    // on clicking the send button in the form
    onSubmit(e) {
      e.preventDefault();

      // check if there are already visits. And create empty array if not.

      if (this.user.visits == undefined) {
        this.user.visits = [];
      }

      // create new visit object
      const visit = {};

      // add new Date to object
      visit.date = new Date();
      // add price to object
      visit.price = this.computedPrice;
      // add membership to object
      visit.member = this.asmember;
      // add partnership to object
      visit.partner = this.aspartner;
      // add visited ateliers to object
      visit.ateliers = this.asatelier;

      // push new visit to visits array.
      this.user.visits.push(visit);

      // set the button to spin
      this.loading = true;
      // call action to add new user
      this.addEntry(this.user)
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
    },

    openNew(e) {
      e.preventDefault();

      // make sure the loading spinner ist showing and dialog fires up
      this.fetching = true;

      // make sure that asmember, asatelier and aspartner are reset
      this.asmember = false;
      this.aspartner = 'no_id';
      this.asatelier = [];

      // fetch single User
      this.fetchSingleUser(this.id)
        .then(res => {
          // get the data and set it to the user
          this.user = res.response.data;

          // remove the loader and show form
          this.fetching = false;

          // calculate user age
          const diff_ms = this.now - new Date(this.user.birthdate).getTime();
          const age_dt = new Date(diff_ms);
          this.userage = Math.abs(age_dt.getUTCFullYear() - 1970);
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
    },
    // compute selects for Partnerbox
    computedPartnersSelect() {
      const partnerNames = [];

      // add default option for no partner
      partnerNames.push({
        name: 'kein Partner',
        id: 'no_id'
      });

      // add partners of user to array
      this.user.partners.forEach(partnerID => {
        const name = this.partners.find(p => p._id === partnerID).partner;

        // add Values to object
        const partnerObject = {
          name: name,
          id: partnerID
        };

        // push object to array
        partnerNames.push(partnerObject);
      });

      return partnerNames;
    },
    computedPrice() {
      let price = 30;

      // price for age
      if (this.userage < 18) {
        price = 10;
      }
      if (this.userage < 12) {
        price = 0;
      }

      // check if as member or partner
      if (this.asmember === true) {
        price = 0;
      }
      if (this.aspartner !== 'no_id') {
        price = 0;
      }

      return price;
    }
  }
};
</script>

<style scoped></style>
