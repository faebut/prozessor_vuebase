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
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>

          <h2 class="primary--text mt-4">Lade Benutzer*in...</h2>
        </v-flex>

        <v-form ref="form" v-if="!fetching">
          <v-layout wrap>
            <v-flex md6 sm12 class="px-2">
              <v-text-field v-model="user.firstname" :rules="[rules.required]" label="Vorname*"></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field v-model="user.name" :rules="[rules.required]" label="Name*"></v-text-field>
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
              <v-text-field v-model="user.address" label="Addresse"></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field v-model="user.postcode" :rules="[rules.required]" label="Postleitzahl*"></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field v-model="user.city" :rules="[rules.required]" label="Ort*"></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field v-model="user.phone" label="Tel. Nummer"></v-text-field>
            </v-flex>

            <v-flex xs12 class="px-2">
              <h1>Abonnemente / Mitgliedschaft / Partnervereine</h1>
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

            <v-flex md6 sm12 class="px-2">
              <v-switch v-model="user.member" color="primary" :label="'Mitglied Verein Prozessor'"></v-switch>
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
              ></v-select>
            </v-flex>

            <v-flex xs6 class="mt-4 px-2">
              <v-btn block :loading="loading" color="warning" dark @click="onSubmit">Ändern</v-btn>
            </v-flex>
            <v-flex xs6 class="mt-4 px-2">
              <v-btn block color="error" dark @click="onCancel">Abbrechen</v-btn>
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
        required: value => !!value || 'Bitte eingeben.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'E-Mail ungültig.';
        }
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
    // ...mapMutations(['clearUserToEdit']), --> check if needed

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
              } erfolgreich geändert`,
              type: 'success'
            });
            // // reset the input fields
            // this.$refs.form.reset();
            // // close dialog
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

    openEdit(e) {
      e.preventDefault();

      // make sure the loading spinner ist showing and dialog fires up
      this.fetching = true;

      // fetch single User
      this.fetchSingleUser(this.id)
        .then(res => {
          // get the data and set it to the user
          this.user = res.response.data;

          // // change the dates to something vue will understand (does not work)
          // this.user.birthdate = new Date(this.user.birthdate).toISOString();
          // this.user.buydate = new Date(this.user.buydate).toISOString();

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

<style></style>
