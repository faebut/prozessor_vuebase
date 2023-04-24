<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <!-- button -->
    <v-btn slot="activator" fab small color="warning" @click="openEdit">
      <v-icon>edit</v-icon>
    </v-btn>

    <!-- form -->
    <v-card>
      <v-card-title v-if="!fetching" class="px-4">
        <h1>Badge UID: {{ badge.uid }} bearbeiten</h1>
      </v-card-title>
      <v-card-text>
        <v-flex v-if="fetching" xs12 class="text-xs-center mb-5 mt-5 pt-5 pb-5">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>

          <h2 class="primary--text mt-4">Lade Badge...</h2>
        </v-flex>

        <v-form v-if="!fetching" ref="form">
          <v-layout wrap>
            <v-flex sm12 class="px-2">
              <v-text-field
                v-model="badge.number"
                :rules="[rules.required]"
                label="Badge-Nummer"
              ></v-text-field>
            </v-flex>

            <v-divider></v-divider>

            <v-flex sm2 class="px-2">
              <v-btn fab color="info">
                <v-icon>sensors</v-icon>
              </v-btn>
            </v-flex>

            <v-flex sm12 class="px-2">
              <v-text-field
                v-model="badge.uid"
                :rules="[rules.required]"
                label="Badge-UID"
              ></v-text-field>
            </v-flex>

            <v-divider></v-divider>

            <v-flex sm6 class="px-2">
              <v-switch
                v-model="badge.inUse"
                inset
                label="Badge in Benutzung"
              ></v-switch>
            </v-flex>

            <v-flex v-if="badge.inUse" sm6 class="px-2">
              <v-switch
                v-model="badge.extern"
                inset
                label="Badge für externe Personen"
              ></v-switch>
            </v-flex>

            <v-flex v-if="!badge.extern && badge.inUse" sm12 class="px-2">
              <v-autocomplete
                v-model="badge.ownerInternID"
                :items="usersList"
                item-text="name"
                item-value="_id"
                clearable
                solo
                dense
                label="Vereinsmitglied"
              ></v-autocomplete>
            </v-flex>

            <v-flex v-if="!badge.extern && badge.inUse" xs6 class="px-2">
              Betriebsgruppe:
              <span v-if="memberCheck.member === null"
                ><v-icon color="secondary">help</v-icon></span
              >
              <span v-if="memberCheck.member === true"
                ><v-icon color="success">check_circle</v-icon></span
              >
              <span v-if="memberCheck.member === false"
                ><v-icon color="error">cancel</v-icon></span
              >
            </v-flex>

            <v-flex v-if="!badge.extern && badge.inUse" xs6 class="px-2">
              Abo gültig:
              <span v-if="memberCheck.abo === null"
                ><v-icon color="secondary">help</v-icon></span
              >
              <span v-if="memberCheck.abo === true"
                ><v-icon color="success">check_circle</v-icon> ({{
                  memberCheck.duration
                }})</span
              >
              <span v-if="memberCheck.abo === false"
                ><v-icon color="error">cancel</v-icon> ({{
                  memberCheck.duration
                }})</span
              >
            </v-flex>

            <v-flex v-if="badge.extern && badge.inUse" sm12 class="px-2">
              <v-text-field
                v-model="badge.ownerFirstName"
                label="Vorname Besitzer*in"
              ></v-text-field>
            </v-flex>

            <v-flex v-if="badge.extern && badge.inUse" sm12 class="px-2">
              <v-text-field
                v-model="badge.ownerLastName"
                label="Nachname Besitzer*in"
              ></v-text-field>
            </v-flex>

            <v-flex v-if="badge.extern && badge.inUse" sm12 class="px-2">
              <v-text-field
                v-model="badge.ownerCity"
                label="Wohnort Besitzer*in"
              ></v-text-field>
            </v-flex>

            <v-flex v-if="badge.extern && badge.inUse" sm12 class="px-2">
              <v-text-field
                v-model="badge.ownerPhone"
                label="Telefonnummer Besitzer*in"
              ></v-text-field>
            </v-flex>

            <v-flex v-if="badge.extern && badge.inUse" sm12 class="px-2">
              <v-textarea
                v-model="badge.purpose"
                label="Nutzungszweck"
              ></v-textarea>
            </v-flex>

            <v-flex sm12 class="px-2"> </v-flex>

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
  name: 'BadgeEdit',
  props: ['id', 'users'],
  data: () => ({
    loading: false,
    dialog: false,
    valid: false,
    fetching: true,
    // rules
    rules: {
      required: (value) => !!value || 'Bitte eingeben.',
    },

    // form fields initally empty --> check if needed
    badge: {},
  }),
  methods: {
    ...mapActions(['fetchSingleBadge', 'editBadge', 'setSnack']),

    // on clicking the send button in the form
    onSubmit(e) {
      e.preventDefault();

      // check if the input is valid
      if (this.$refs.form.validate()) {
        // set the button to spin
        this.loading = true;
        // call action to edit atelier
        this.editBadge(this.badge)
          .then(() => {
            // remove spinner
            this.loading = false;
            // show snackbar for success
            this.setSnack({
              message: `Badge UID: ${this.badge.uid} erfolgreich geändert`,
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
      this.fetchSingleBadge(this.id)
        .then((res) => {
          // get the data and set it to the user
          this.badge = res.response.data;

          // set the id of the atelier to the id prop
          this.badge._id = this.id;

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
    buttonColor() {
      if (this.badge.number == '' || this.badge.uid == '') {
        return 'secondary';
      }
      return 'success';
    },
    usersList() {
      const namedUsers = [];

      for (let i = 0; i < this.users.length; i++) {
        const user = {
          name: `${this.users[i].firstname} ${this.users[i].name}, ${this.users[i].city}`,
          _id: this.users[i]._id,
          member: this.users[i].member,
          abo: this.users[i].abo,
        };

        namedUsers.push(user);
      }

      return namedUsers;
    },
    // check if member and paid abo
    memberCheck() {
      let user = null;
      let member = null;
      let duration = null;
      let abo = null;

      if (this.badge.ownerInternID != null) {
        user = this.users.filter(
          (user) => user._id === this.badge.ownerInternID
        );

        if (user[0].member === true) {
          member = true;
        } else {
          member = false;
        }

        const today = new Date();
        const buydate = new Date(user[0].buydate);

        const difference = today - buydate;

        const total_seconds = parseInt(Math.floor(difference / 1000));
        const total_minutes = parseInt(Math.floor(total_seconds / 60));
        const total_hours = parseInt(Math.floor(total_minutes / 60));
        const days = parseInt(Math.floor(total_hours / 24));
        const restdays = 365 - days;

        if (restdays > 0) {
          duration = restdays;
          abo = true;
        } else if (restdays < 0) {
          abo = false;
          duration = restdays;
        } else {
          abo = false;
        }
      }

      return {
        member,
        abo,
        duration,
      };
    },
  },
};
</script>

<style></style>
