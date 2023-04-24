<template>
  <v-dialog max-width="800px" v-model="dialog">
    <v-btn flat class="success" slot="activator">Besucher*in hinzufügen</v-btn>
    <v-card>
      <v-card-title class="px-4">
        <h1>Besucher*in hinzufügen</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-layout wrap>
            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="user.firstname"
                :rules="[rules.required]"
                label="Vorname*"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="user.name"
                :rules="[rules.required]"
                label="Name*"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-menu
                v-model="datePickerBirthday"
                :close-on-content-click="false"
                full-width
                max-width="290"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="computedDateBirthdate"
                    clearable
                    label="Geburtstag*"
                    prepend-icon="cake"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="user.birthdate"
                  @change="datePickerBirthday = false"
                  locale="de"
                  color="primary"
                ></v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="user.email"
                :rules="[rules.required, rules.email]"
                label="E-Mail*"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="user.address"
                label="Addresse"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="user.postcode"
                :rules="[rules.required]"
                label="Postleitzahl*"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="user.city"
                :rules="[rules.required]"
                label="Ort*"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="user.phone"
                label="Tel. Nummer"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 class="px-2">
              <h1>Abonnemente / Betriebsgruppe / Partnervereine</h1>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-menu
                v-model="datePickerBuydate"
                :close-on-content-click="false"
                full-width
                max-width="290"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="computedDateBuydate"
                    clearable
                    label="Jahresabonnement ab wann"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="user.buydate"
                  @change="datePickerBuydate = false"
                  locale="de"
                ></v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex md6 sm12 class="pt-3">
              <v-btn color="error" small dark @click="user.buydate = null"
                >Abonnement löschen</v-btn
              >
            </v-flex>

            <v-flex xs12 class="px-2">
              <v-switch
                v-model="user.member"
                color="primary"
                :label="'Betriebsgruppe Prozessor'"
              ></v-switch>
            </v-flex>

            <v-flex v-if="user.member" xs12 class="px-2">
              <v-switch
                v-model="user.expert"
                color="primary"
                :label="'Expert*in'"
              ></v-switch>
            </v-flex>

            <v-flex v-if="user.expert" xs12 class="px-2">
              <v-select
                v-model="user.expertise"
                :items="computedAteliersSelect"
                item-value="id"
                item-text="name"
                hide-selected
                deletable-chips
                attach
                chips
                label="Expertise auswählen"
                multiple
                menu-props="closeOnContentClick"
              ></v-select>
            </v-flex>

            <v-flex xs12 class="px-2">
              <v-switch
                v-model="user.helper"
                color="primary"
                :label="'Helfer*in'"
              ></v-switch>
            </v-flex>

            <v-flex xs12 class="px-2">
              <v-select
                v-model="user.partners"
                :items="partners"
                item-value="_id"
                item-text="partner"
                hide-selected
                deletable-chips
                attach
                chips
                label="Partnervereine/institutionen auswählen"
                multiple
                menu-props="closeOnContentClick"
              ></v-select>
            </v-flex>

            <v-flex xs12 class="px-2">
              <h1>Nutzungsvereinbarung / Infos</h1>
            </v-flex>

            <v-flex xs12 class="px-2">
              <v-switch
                v-model="user.agreement"
                color="primary"
                :label="'Nutzungsvereinbarung unterschrieben'"
              ></v-switch>
            </v-flex>

            <v-flex xs12 class="px-2">
              <v-textarea
                v-model="user.infos"
                filled
                label="Weitere Infos / Allergien / Spezielles"
                auto-grow
              ></v-textarea>
            </v-flex>

            <v-flex xs12 class="mt-4">
              <v-btn
                block
                :loading="loading"
                color="primary"
                dark
                @click="onSubmit"
                >Absenden</v-btn
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
  name: 'UserCreate',
  data: () => ({
    loading: false,
    dialog: false,
    valid: false,
    // rules
    rules: {
      required: (value) => !!value || 'Bitte eingeben.',
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'E-Mail ungültig.';
      },
    },
    // date Stuff
    datePickerBirthday: false,
    datePickerBuydate: false,
    // form fields
    user: {
      firstname: '',
      name: '',
      birthdate: '',
      email: '',
      address: '',
      postcode: '',
      city: '',
      phone: '',
      buydate: null,
      partners: [],
      member: false,
      agreement: false,
      infos: '',
      expert: false,
      helper: false,
      expertise: [],
    },
  }),
  methods: {
    ...mapActions(['fetchPartners', 'fetchAteliers', 'addUser', 'setSnack']),

    // on clicking the send button in the form
    onSubmit(e) {
      e.preventDefault();

      // check if the input is valid
      if (this.$refs.form.validate()) {
        // delete expertise if user is not expert
        if (this.user.expert == false) {
          this.user.expertise = [];
        }
        // set the button to spin
        this.loading = true;
        // call action to add new user
        this.addUser(this.user)
          .then(() => {
            // remove spinner
            this.loading = false;
            // show snackbar for success
            this.setSnack({
              message: `Besucher*in ${this.user.firstname} ${this.user.name} erfolgreich hinzugefügt`,
              type: 'success',
            });
            // reset the input fields
            this.$refs.form.reset();
            this.user.buydate = null;
            // close dialog
            this.dialog = false;
          })
          .catch((err) => {
            // show snackbar for error
            this.setSnack({
              message: `Error: ${err}`,
              type: 'error',
            });
          });
      }
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

    // Format the Buydate
    computedDateBuydate() {
      return this.user.buydate
        ? format(this.user.buydate, 'DD. MMMM YYYY', { locale: locales })
        : '';
    },
    // compute selects for Expertisebox
    computedAteliersSelect() {
      const atelierNames = [];

      // add ateliers to array
      this.ateliers.forEach((atelierID) => {
        // add Values to object
        const atelierObject = {
          name: atelierID.name,
          id: atelierID._id,
        };

        // push object to array
        atelierNames.push(atelierObject);
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
