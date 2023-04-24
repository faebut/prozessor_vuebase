<template>
  <v-dialog max-width="800px" v-model="dialog">
    <v-btn flat class="success" slot="activator">Partner hinzufügen</v-btn>
    <v-card>
      <v-card-title class="px-4">
        <h1>Partner*in hinzufügen</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
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
import { mapActions } from 'vuex';

export default {
  name: 'PartnerCreate',
  data() {
    return {
      // state of button before sending
      loading: false,

      // don't show dialog before it is clicked
      dialog: false,

      // rules for the form-fields
      rules: {
        required: (value) => !!value || 'Bitte eingeben.',
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'E-Mail ungültig.';
        },
      },
      // dont show date pickers before the field is clicked
      datePickerBirthday: false,
      datePickerBuydate: false,

      // form fields
      partner: {
        partner: '',
        contactname: '',
        contactfirstname: '',
        address: '',
        postcode: '',
        city: '',
        email: '',
        description: null,
        visits: [],
      },
    };
  },
  methods: {
    ...mapActions(['addPartner', 'setSnack']),

    // on clicking the send button in the form
    onSubmit(e) {
      e.preventDefault();

      // check if the input is valid
      if (this.$refs.form.validate()) {
        // set the button to spin
        this.loading = true;
        // call action to add new partner
        this.addPartner(this.partner)
          .then(() => {
            // remove spinner
            this.loading = false;
            // show snackbar for success
            this.setSnack({
              message: `Partner*in ${this.partner.partner} erfolgreich hinzugefügt`,
              type: 'success',
            });
            // reset the input fields
            this.$refs.form.reset();
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
};
</script>

<style></style>
