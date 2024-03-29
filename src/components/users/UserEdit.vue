<template>
  <v-dialog max-width="800px" persistent v-model="dialog">
    <!-- button -->
    <v-btn fab small color="warning" @click="openEdit" slot="activator">
      <v-icon>edit</v-icon>
    </v-btn>

    <!-- form -->
    <v-card>
      <v-card-title v-if="!fetching" class="px-4">
        <h1>{{ user.firstname }} {{ user.name }} bearbeiten</h1>
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

            <v-flex xs6 class="mt-4 px-2">
              <v-btn
                block
                :loading="loading"
                color="warning"
                dark
                @click="onSubmit"
                >Ändern</v-btn
              >
            </v-flex>
            <v-flex xs6 class="mt-4 px-2">
              <v-btn block color="error" dark @click="onCancel"
                >Abbrechen</v-btn
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
  name: 'UserEdit',
  props: ['id'],
  data: () => {
    return {
      loading: false,
      dialog: false,
      valid: false,
      fetching: true,
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

      // form fields initally empty --> check if needed
      user: {},
    };
  },
  methods: {
    ...mapActions([
      'fetchPartners',
      'fetchSingleUser',
      'fetchAteliers',
      'editUser',
      'setSnack',
    ]),

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
        this.editUser(this.user)
          .then(() => {
            // remove spinner
            this.loading = false;
            // show snackbar for success
            this.setSnack({
              message: `Besucher*in ${this.user.firstname} ${this.user.name} erfolgreich geändert`,
              type: 'success',
            });
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

    changeDate() {},

    openEdit(e) {
      e.preventDefault();

      // make sure the loading spinner ist showing and dialog fires up
      this.fetching = true;

      // fetch single User
      this.fetchSingleUser(this.id)
        .then((res) => {
          // get the data and set it to the user
          this.user = res.response.data;

          // set the id of the user to the id prop
          this.user._id = this.id;

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
