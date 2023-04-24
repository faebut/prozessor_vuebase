<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-btn slot="activator" flat class="success">Badge hinzufügen</v-btn>
    <v-card>
      <v-card-title class="px-4">
        <h1>Badge hinzufügen</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
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

            <v-flex xs12 class="mt-4">
              <v-btn
                block
                :loading="loading"
                :color="buttonColor"
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
  props: ['users'],
  data() {
    return {
      // state of button before sending
      loading: false,

      // don't show dialog before it is clicked
      dialog: false,

      // rules for the form-fields
      rules: {
        required: (value) => !!value || 'Bitte eingeben.',
      },

      // form fields
      badge: {
        number: '',
        uid: '',
        inUse: false,
        extern: false,
        ownerInternID: null,
        ownerLastName: '',
        ownerFirstName: '',
        ownerCity: '',
        ownerPhone: '',
        purpose: '',
      },
    };
  },
  methods: {
    ...mapActions(['addBadge', 'setSnack']),

    // on clicking the send button in the form
    onSubmit(e) {
      e.preventDefault();

      // check if the input is valid
      if (this.$refs.form.validate()) {
        // set the button to spin
        this.loading = true;
        // call action to add new partner
        this.addBadge(this.badge)
          .then(() => {
            // remove spinner
            this.loading = false;
            // show snackbar for success
            this.setSnack({
              message: `Badge mit UID: ${this.badge.uid} erfolgreich hinzugefügt`,
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
