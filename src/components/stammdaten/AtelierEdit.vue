<template>
  <v-dialog max-width="800px" persistent v-model="dialog">
    <!-- button -->
    <v-btn fab small color="warning" @click="openEdit" slot="activator">
      <v-icon>edit</v-icon>
    </v-btn>

    <!-- form -->
    <v-card>
      <v-card-title v-if="!fetching" class="px-4">
        <h1>{{ atelier.name }} bearbeiten</h1>
      </v-card-title>
      <v-card-text>
        <v-flex xs12 class="text-xs-center mb-5 mt-5 pt-5 pb-5" v-if="fetching">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>

          <h2 class="primary--text mt-4">Lade Werkstatt/Atelier...</h2>
        </v-flex>

        <v-form ref="form" v-if="!fetching">
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
  name: 'AtelierEdit',
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
      },

      // form fields initally empty --> check if needed
      atelier: {},
    };
  },
  methods: {
    ...mapActions(['fetchSingleAtelier', 'editAtelier', 'setSnack']),

    // on clicking the send button in the form
    onSubmit(e) {
      e.preventDefault();

      // check if the input is valid
      if (this.$refs.form.validate()) {
        // set the button to spin
        this.loading = true;
        // call action to edit atelier
        this.editAtelier(this.atelier)
          .then(() => {
            // remove spinner
            this.loading = false;
            // show snackbar for success
            this.setSnack({
              message: `Atelier/Werkstatt ${this.atelier.name}  erfolgreich geändert`,
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

    openEdit(e) {
      e.preventDefault();

      // make sure the loading spinner ist showing and dialog fires up
      this.fetching = true;

      // fetch single User
      this.fetchSingleAtelier(this.id)
        .then((res) => {
          // get the data and set it to the user
          this.atelier = res.response.data;

          // set the id of the atelier to the id prop
          this.atelier._id = this.id;

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
};
</script>

<style></style>
