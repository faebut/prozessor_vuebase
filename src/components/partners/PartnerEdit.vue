<template>
  <v-dialog max-width="800px" persistent v-model="dialog">
    <!-- button -->
    <v-btn fab small color="warning" @click="openEdit" slot="activator">
      <v-icon>edit</v-icon>
    </v-btn>

    <!-- form -->
    <v-card>
      <v-card-title v-if="!fetching" class="px-4">
        <h1>{{ partner.partner }} bearbeiten</h1>
      </v-card-title>
      <v-card-text>
        <v-flex xs12 class="text-xs-center mb-5 mt-5 pt-5 pb-5" v-if="fetching">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>

          <h2 class="primary--text mt-4">Lade Partner*in...</h2>
        </v-flex>

        <v-form ref="form" v-if="!fetching">
          <v-layout wrap>
            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="partner.partner"
                :rules="[rules.required]"
                label="Partner*in"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="partner.city"
                :rules="[rules.required]"
                label="Ort*"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="partner.postcode"
                :rules="[rules.required]"
                label="PLZ*"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="partner.address"
                label="Adresse"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="partner.contactfirstname"
                label="Kontaktperson Vorname"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="partner.contactname"
                label="Kontaktperson Name"
              ></v-text-field>
            </v-flex>

            <v-flex md6 sm12 class="px-2">
              <v-text-field
                v-model="partner.email"
                label="Kontakt E-Mail*"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
            </v-flex>

            <v-flex sm12 class="px-2">
              <v-textarea
                v-model="partner.description"
                label="Beschreibung / Infos"
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
import { mapActions } from 'vuex';

export default {
  name: 'PartnerEdit',
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

      // form fields initally empty --> check if needed
      partner: {}
    };
  },
  methods: {
    ...mapActions(['fetchSinglePartner', 'editPartner', 'setSnack']),
    // ...mapMutations(['clearUserToEdit']), --> check if needed

    // on clicking the send button in the form
    onSubmit(e) {
      e.preventDefault();

      // check if the input is valid
      if (this.$refs.form.validate()) {
        // set the button to spin
        this.loading = true;
        // call action to add new user
        this.editPartner(this.partner)
          .then(() => {
            // remove spinner
            this.loading = false;
            // show snackbar for success
            this.setSnack({
              message: `Partner*in ${
                this.partner.partner
              }  erfolgreich geändert`,
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

    openEdit(e) {
      e.preventDefault();

      // make sure the loading spinner ist showing and dialog fires up
      this.fetching = true;

      // fetch single User
      this.fetchSinglePartner(this.id)
        .then(res => {
          // get the data and set it to the user
          this.partner = res.response.data;

          // set the id of the partner to the id prop
          this.partner._id = this.id;

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

      // // reset the userToEdit in storage --> Check if needed
      // this.clearUserToEdit();

      // close dialog
      this.dialog = false;
    }
  }
};
</script>

<style></style>
