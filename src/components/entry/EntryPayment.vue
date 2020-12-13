<template>
  <v-dialog max-width="800px" persistent v-model="dialog">
    <!-- button -->
    <v-icon class="warning--text" @click="openNew" slot="activator"
      >credit_card</v-icon
    >

    <!-- form -->
    <v-card>
      <v-card-title class="px-4">
        <h1>Abrechnung für {{ user.firstname }} {{ user.name }}</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-layout row wrap>
            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Ort</div>
              <div>{{ user.postcode }} {{ user.city }}</div>
            </v-flex>

            <v-flex xs6 sm6 md3 class="px-2">
              <div class="caption grey--text">Geburtstag</div>
              <div>{{ computedDateBirthdate }}</div>
            </v-flex>

            <v-flex xs6 sm6 md3 class="px-2 mt-2">
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
            </v-flex>
            <v-flex xs6 sm6 md3 class="px-2 mt-2">
              <div v-if="user.member">
                <div class="caption grey--text" v-if="user.member">
                  Mitglied Prozessor
                </div>
                <div>Mitglied Verein Prozessor</div>
              </div>
              <div v-if="user.helper">
                <div class="caption grey--text" v-if="user.helper">
                  Helfer*in
                </div>
                <div>Helfer*in Verein Prozessor</div>
              </div>
            </v-flex>

            <v-flex xs12 class="px-2">
              <h2>Grundpreis</h2>
            </v-flex>

            <v-flex xs6 class="px-2">
              <div class="caption grey--text">Grundtarif</div>
              <div>
                <span v-if="userage < 12">Kinder unter 12 Jahren</span>
                <span v-if="userage < 18 && userage > 12"
                  >Jugendliche unter 18 Jahren</span
                >
                <span v-if="userage > 17 && !visit.member && !visit.helper"
                  >Erwachsene</span
                >
                <span v-if="visit.member">Mitglied</span>
                <span v-if="visit.helper">Helfer*in</span>
              </div>
            </v-flex>

            <v-flex xs6 class="px-2">
              <div class="caption grey--text">Eintrittspreis</div>
              <div>
                CHF {{ computedPrice }}.-
                <span
                  v-if="!visit.member && !visit.helper && timepassed < 7200000"
                  class="success--text"
                >
                  (Kurzzeitnutzung)</span
                >
              </div>
            </v-flex>

            <v-flex
              xs12
              class="px-2 mt-2"
              v-if="!visit.member && !visit.helper"
            >
              <div class="caption grey--text">Spezialnutzung</div>
              <div>
                <v-switch
                  v-model="freeprice"
                  label="Freien Betrag eingeben"
                ></v-switch>
              </div>
            </v-flex>

            <v-flex xs12 class="px-2" v-if="freeprice">
              <v-text-field
                v-model="paid.baseprice"
                label="Betrag in CHF*"
              ></v-text-field>
            </v-flex>

            <v-flex xs6 class="px-2 mt-2">
              <h3>Total Eintrittspreis</h3>
            </v-flex>

            <v-flex xs6 class="px-2 mt-2">
              <h3 v-if="paid.baseprice">CHF {{ paid.baseprice }}.-</h3>
              <h3 v-else>CHF {{ computedPrice }}.-</h3>
            </v-flex>

            <v-flex xs12 class="px-2 mt-4">
              <h2>Material hinzufügen</h2>
            </v-flex>

            <v-flex xs8 class="px-2">
              <v-text-field
                v-model="item.description"
                label="Beschreibung"
                ref="description"
              ></v-text-field>
            </v-flex>

            <v-flex xs2 class="px-2">
              <v-text-field
                v-model="item.price"
                label="Betrag in CHF"
                @keyup.enter.native="newMaterialItem"
              ></v-text-field>
            </v-flex>

            <v-flex xs2 class="px-2">
              <v-btn class="success" fab dark small @click="newMaterialItem"
                ><v-icon dark>plus_one</v-icon></v-btn
              ></v-flex
            >

            <v-flex
              xs12
              v-for="(addon, index) in paid.addons"
              :key="index"
              class="px-2"
            >
              <v-card elevation="2" color="grey lighten-4" class="px-2 mt-2">
                <v-card-text>
                  <v-layout>
                    <v-flex xs9>
                      {{ addon.description }}
                    </v-flex>
                    <v-flex xs2> CHF {{ addon.price }}.- </v-flex>
                    <v-flex xs1>
                      <v-icon
                        @click="deleteMaterialItem(index)"
                        class="error--text"
                        >delete</v-icon
                      >
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 class="px-2 mt-4">
              <h2>Bezahlen</h2>
            </v-flex>

            <v-flex xs6 class="px-2 mt-2">
              <h3 class="total">Total Eintrittspreis + Material</h3>
            </v-flex>

            <v-flex xs6 class="px-2 mt-2">
              <h3 class="total">CHF {{ totalPrice }}.-</h3>
            </v-flex>

            <v-flex xs2 class="px-2">
              <v-select
                v-model="paid.paidby"
                :items="['bar', 'twint']"
                label="Zahlart"
                :rules="[rules.payment]"
              ></v-select>
            </v-flex>

            <v-flex xs12 class="mt-3">
              <v-btn color="success" dark @click="onSubmit">Bezahlen</v-btn>
              <v-btn color="error" dark @click="onCancel">Abbrechen</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import format from 'date-fns/format';
import locales from 'date-fns/locale/de';

export default {
  name: 'EntryPayment',
  props: ['user', 'visit', 'ateliers', 'timepassed'],
  data() {
    return {
      dialog: false,
      // Switches
      freeprice: false,
      // Material item
      item: {
        description: '',
        price: null
      },
      // Special pricing
      paid: {
        baseprice: null,
        addons: [],
        paidby: ''
      },
      // rules for the form
      rules: {
        payment: value => value.length > 0 || 'Bitte Zahlart wählen.'
      }
    };
  },
  methods: {
    ...mapActions(['addPayment', 'setSnack']),
    openNew(e) {
      e.preventDefault();
    },
    onSubmit(e) {
      e.preventDefault();

      const payment = {
        user: this.user,
        paid: {
          baseprice: this.paid.baseprice
            ? this.paid.baseprice
            : this.computedPrice,
          addons: this.paid.addons,
          paidby: this.paid.paidby
        }
      };

      // check if the input is valid
      if (this.$refs.form.validate()) {
        // send payment
        this.addPayment(payment)
          .then(() => {
            // show snackbar for success
            this.setSnack({
              message: `Bezahlung für ${this.user.firstname} ${
                this.user.name
              } erfolgreich erfasst`,
              type: 'success'
            });
            // close dialog
            this.dialog = false;

            // emit to parent, that it's paid now
            this.$emit('is-paid');
          })
          .catch(err => {
            // show snackbar for error
            this.setSnack({
              message: `Error: ${err}`,
              type: 'error'
            });
          });

        // close dialog
        this.dialog = false;
        this.freeprice = false;
        this.paid.baseprice = null;
        this.paid.addons = [];
        this.paid.paidby = '';
        // reset item
        this.item = {
          description: '',
          price: null,
          paidby: ''
        };
      }
    },
    // on clicking the cancel button in the form
    onCancel(e) {
      e.preventDefault();

      // close dialog
      this.dialog = false;
      this.freeprice = false;
      this.paid.baseprice = null;
      this.paid.addons = [];
      this.paid.paidby = '';
      // reset item
      this.item = {
        description: '',
        price: null,
        paidby: ''
      };
    },
    newMaterialItem(e) {
      e.preventDefault();

      this.paid.addons.push(this.item);

      this.$refs.description.focus();

      // reset item
      this.item = {
        description: '',
        price: null,
        paidby: ''
      };
    },
    deleteMaterialItem(idx) {
      this.paid.addons.splice(idx, 1);
    }
  },
  computed: {
    // Format the Birthdate
    computedDateBirthdate() {
      return this.user.birthdate
        ? format(this.user.birthdate, 'DD. MMMM YYYY', {
            locale: locales
          })
        : '';
    },

    // Format the end date
    computedDateEnddate() {
      const datestring = new Date(this.user.buydate);

      const enddate = new Date(
        datestring.setFullYear(datestring.getFullYear() + 1)
      );

      return enddate
        ? format(enddate, 'DD. MMMM YYYY', { locale: locales })
        : '';
    },
    validAbo() {
      // format the end date
      const datestring = new Date(this.user.buydate);

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
      const diff_ms = new Date() - new Date(this.user.birthdate).getTime();

      const age_dt = new Date(diff_ms);
      const userage = Math.abs(age_dt.getUTCFullYear() - 1970);

      return userage;
    },
    computedPrice() {
      let price = 30;

      // short time usage
      if (this.timepassed < 7200000) {
        price = 10;
      }

      // price for age
      if (this.userage < 18) {
        price = 10;
      }
      if (this.userage < 12) {
        price = 0;
      }

      // check if as member, helper or partner
      if (this.visit.member === true) {
        price = 0;
      }
      if (this.visit.partner !== 'no_id') {
        price = 0;
      }
      if (this.visit.helper === true) {
        price = 0;
      }

      // check if abonnement is valid
      if (this.validAbo === 'ja') {
        price = 0;
      }

      return price;
    },
    totalPrice() {
      const entryprice = parseFloat(
        this.paid.baseprice ? this.paid.baseprice : this.computedPrice
      );

      let materialprice = 0;

      // add all itemprices to materialprice if there are any
      if (this.paid.addons.length > 0) {
        for (let i = 0; i < this.paid.addons.length; i++) {
          materialprice = materialprice + parseFloat(this.paid.addons[i].price);
        }
      }

      return materialprice + entryprice;
    }
  }
};
</script>

<style scoped>
.total {
  font-weight: 700;
}
</style>
