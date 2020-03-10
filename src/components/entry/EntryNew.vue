.<template>
  <v-dialog max-width="800px" persistent v-model="dialog">
    <!-- button -->
    <v-icon class="success--text" @click="openNew" slot="activator"
      >exit_to_app</v-icon
    >

    <!-- form -->
    <v-card>
      <v-card-title v-if="!fetching" class="px-4">
        <h1>{{ userToEdit.firstname }} {{ userToEdit.name }} einchecken</h1>
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
              <div>{{ userToEdit.firstname }} {{ userToEdit.name }}</div>
              <div>
                <br />
              </div>
              <div v-if="userToEdit.address !== ''">
                {{ userToEdit.address }}
              </div>
              <div>{{ userToEdit.postcode }} {{ userToEdit.city }}</div>
            </v-flex>

            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Geburtstag</div>
              <div>{{ computedDateBirthdate }}</div>
              <div>
                <br />
              </div>
              <div class="caption grey--text">Kontakt</div>
              <div>{{ userToEdit.email }}</div>
              <div>{{ userToEdit.phone }}</div>
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
              <div v-if="userToEdit.member">
                <div class="caption grey--text" v-if="userToEdit.member">
                  Mitglied Prozessor
                </div>
                <div>Mitglied Verein Prozessor</div>
              </div>
            </v-flex>

            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Partnerschaften</div>
              <div v-if="userToEdit.partners">
                <v-chip v-for="partner in computedPartners" :key="partner">{{
                  partner
                }}</v-chip>
              </div>
              <div v-else>Keine Partnerschaften</div>
              <div class="text-xs-right pr-2 pt-3">
                <user-edit :id="id" />
              </div>
            </v-flex>

            <v-flex xs12 class="px-2 mt-4 mb-3">
              <h2>Einchecken</h2>
            </v-flex>

            <v-flex
              v-if="userToEdit.member && aspartner === 'no_id'"
              xs6
              class="px-2"
            >
              <div class="caption grey--text">Mitglied</div>
              <div>
                <v-switch
                  v-model="asmember"
                  label="als Mitglied einchecken"
                ></v-switch>
              </div>
            </v-flex>

            <v-flex v-if="userToEdit.partners && !asmember" xs6 class="px-2">
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
                  :items="computedAteliersSelect"
                  item-value="id"
                  item-text="name"
                  :rules="[rules.required]"
                  hide-selected
                  deletable-chips
                  attach
                  chips
                  label="Ateliers/Werkstätten auswählen"
                  multiple
                  menu-props="closeOnContentClick"
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

            <v-flex v-if="!userToEdit.agreement" xs12 class="px-2 mt-3">
              <v-card color="error" dark>
                <v-card-actions>
                  <div class="font-weight-bold">
                    Nutzungsvereinbarung noch nicht unterschrieben!
                  </div>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="ma-2"
                    outline
                    @click="userToEdit.agreement = true"
                    color="white"
                    >jetzt unterschreiben!</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-flex>

            <v-flex v-if="userToEdit.agreement" xs12 class="px-2 mt-3">
              <v-card color="success" dark>
                <v-card-text class="font-weight-bold">
                  Nutzungsvereinbarung unterschrieben
                  <v-icon>done</v-icon>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 class="mt-3">
              <v-btn v-if="!userToEdit.agreement" color="success" dark>
                <v-icon>not_interested</v-icon>
              </v-btn>
              <v-btn v-else color="success" dark @click="onSubmit"
                >Einchecken</v-btn
              >
              <v-btn color="error" dark @click="onCancel">Abbrechen</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import UserEdit from '../users/UserEdit';
import format from 'date-fns/format';
import locales from 'date-fns/locale/de';

export default {
  name: 'EntryNew',
  components: {
    UserEdit
  },
  props: ['id', 'partners', 'ateliers'],
  data: () => {
    return {
      loading: false,
      dialog: false,
      valid: false,
      fetching: true,
      // rules
      rules: {
        required: value => value.length > 0 || 'Bitte eingeben.'
      },
      // date Stuff
      datePickerBirthday: false,
      datePickerBuydate: false,

      // checked in as member
      asmember: false,

      // checked in as partner
      aspartner: 'no_id',

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

      if (this.userToEdit.visits == undefined) {
        this.userToEdit.visits = [];
      }

      // check if the input is valid
      if (this.$refs.form.validate()) {
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
        // add valid abonnement to object
        if (this.validAbo === 'ja') {
          visit.abonnement = true;
        } else {
          visit.abonnement = false;
        }

        // push new visit to visits array.
        this.userToEdit.visits.push(visit);

        // set id to User id
        this.userToEdit._id = this.id;

        // set the button to spin
        this.loading = true;
        // call action to add new user
        this.addEntry(this.userToEdit)
          .then(() => {
            // remove spinner
            this.loading = false;
            // show snackbar for success
            this.setSnack({
              message: `Besucher*in ${this.userToEdit.firstname} ${
                this.userToEdit.name
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
        .then(() => {
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
    },
    onAgreement(e) {
      e.preventDefault();

      // create an agreement property and set it to true
      this.userToEdit.agreement = true;
    }
  },
  computed: {
    ...mapGetters(['userToEdit']),
    // Format the Birthdate
    computedDateBirthdate() {
      return this.userToEdit.birthdate
        ? format(this.userToEdit.birthdate, 'DD. MMMM YYYY', {
            locale: locales
          })
        : '';
    },

    // Format the end date
    computedDateEnddate() {
      const datestring = new Date(this.userToEdit.buydate);

      const enddate = new Date(
        datestring.setFullYear(datestring.getFullYear() + 1)
      );

      return enddate
        ? format(enddate, 'DD. MMMM YYYY', { locale: locales })
        : '';
    },
    computedPartners() {
      const partnerNames = [];

      this.userToEdit.partners.forEach(partnerID => {
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
      this.userToEdit.partners.forEach(partnerID => {
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
    // compute selects for Atelierbox
    computedAteliersSelect() {
      const atelierNames = [];

      // add ateliers to array
      this.ateliers.forEach(atelierID => {
        // add Values to object
        const atelierObject = {
          name: atelierID.name,
          id: atelierID._id
        };

        // push object to array
        atelierNames.push(atelierObject);
      });

      return atelierNames;
    },
    validAbo() {
      // format the end date
      const datestring = new Date(this.userToEdit.buydate);

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
    userage() {
      // calculate user age
      const diff_ms =
        new Date() - new Date(this.userToEdit.birthdate).getTime();

      const age_dt = new Date(diff_ms);
      const userage = Math.abs(age_dt.getUTCFullYear() - 1970);

      return userage;
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

      // check if abonnement is valid
      if (this.validAbo === 'ja') {
        price = 0;
      }

      return price;
    }
  }
};
</script>

<style scoped></style>
