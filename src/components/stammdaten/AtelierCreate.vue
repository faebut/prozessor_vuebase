<template>
  <v-dialog max-width="800px" v-model="dialog">
    <v-btn flat class="success" slot="activator"
      >Atelier/Werkstatt hinzufügen</v-btn
    >
    <v-card>
      <v-card-title class="px-4">
        <h1>Atelier/Werkstatt hinzufügen</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-layout wrap>
            <v-flex sm12 class="px-2">
              <v-text-field
                v-model="atelier.name"
                :rules="[rules.required]"
                label="Atelier/Werkstatt"
              ></v-text-field>
            </v-flex>

            <v-flex sm12 class="px-2">
              <v-textarea
                v-model="atelier.description"
                :rules="[rules.required]"
                label="Beschreibung / Infos"
              ></v-textarea>
            </v-flex>

            <v-flex sm4 class="px-2">
              <v-text-field
                v-model="atelier.icon"
                :rules="[rules.required]"
                label="Icon"
              ></v-text-field>
            </v-flex>

            <v-flex xs8 class="px-2 mt-3">
              <v-icon class="purple--text">{{ atelier.icon }}</v-icon>
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
  name: 'AtelierCreate',
  data() {
    return {
      // state of button before sending
      loading: false,

      // don't show dialog before it is clicked
      dialog: false,

      // rules for the form-fields
      rules: {
        required: value => !!value || 'Bitte eingeben.'
      },

      // form fields
      atelier: {
        name: '',
        description: '',
        icon: ''
      }
    };
  },
  methods: {
    ...mapActions(['addAtelier', 'setSnack']),

    // on clicking the send button in the form
    onSubmit(e) {
      e.preventDefault();

      // check if the input is valid
      if (this.$refs.form.validate()) {
        // set the button to spin
        this.loading = true;
        // call action to add new partner
        this.addAtelier(this.atelier)
          .then(() => {
            // remove spinner
            this.loading = false;
            // show snackbar for success
            this.setSnack({
              message: `Atelier/Werkstatt ${
                this.atelier.name
              } erfolgreich hinzugefügt`,
              type: 'success'
            });
            // reset the input fields
            this.$refs.form.reset();
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
    }
  }
};
</script>

<style></style>
