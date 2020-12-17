<template>
  <v-card flat class="pa-3 mb-1">
    <v-layout row wrap>
      <v-flex xs2>
        <v-icon v-if="visit.member === true" class="success--text"
          >person</v-icon
        >
        <v-icon v-if="visit.partner === 'no_id' && visit.member === false"
          >person</v-icon
        >
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              v-if="visit.partner !== 'no_id'"
              class="success--text"
              v-on="on"
              >group</v-icon
            >
          </template>
          <span>{{ computedPartner }}</span>
        </v-tooltip>
        <v-icon v-if="visit.helper" class="error--text">stars</v-icon>
        <v-icon v-if="validAbo === 'ja'" class="success--text"
          >verified_user</v-icon
        >
      </v-flex>

      <v-flex xs2>
        <v-icon v-for="atelier in computedAteliers" :key="atelier.name">{{
          atelier.icon
        }}</v-icon>
      </v-flex>

      <v-flex xs4>
        <div>{{ user.firstname }} {{ user.name }}, {{ user.city }}</div>
      </v-flex>

      <v-flex xs2>
        <v-icon>access_time</v-icon> {{ computedTime.formatted }}
      </v-flex>

      <v-flex xs1>
        <entry-payment
          :visit="visit"
          :user="user"
          :ateliers="ateliers"
          :timepassed="computedTime.unformatted"
          v-if="!paid"
          @is-paid="togglePaid"
        ></entry-payment>
        <entry-payment-edit
          v-else
          :visit="visit"
          :user="user"
          :ateliers="ateliers"
          :timepassed="computedTime.unformatted"
          @is-paid="togglePaid"
        ></entry-payment-edit>
      </v-flex>

      <v-flex xs1>
        <v-icon class="error--text" @click="deleteVisit(user)">delete</v-icon>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import EntryPayment from '@/components/entry/EntryPayment';
import EntryPaymentEdit from '@/components/entry/EntryPaymentEdit';

export default {
  name: 'EntryLoggedInUser',
  props: ['user', 'visit', 'ateliers'],
  data() {
    return {
      paid: false
    };
  },
  components: {
    EntryPayment,
    EntryPaymentEdit
  },
  methods: {
    ...mapActions(['deleteVisit']),
    togglePaid() {
      this.paid = !this.paid;
    }
  },
  computed: {
    ...mapGetters(['partners']),
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
    computedPartner() {
      if (this.visit.partner !== 'no_id') {
        const partner = this.partners.find(x => x._id === this.visit.partner)
          .partner;

        return partner;
      } else {
        return 'nopartner';
      }
    },
    computedAteliers() {
      const ateliersarray = [];

      // get for each logged in atelier the object from ateliers and add it to the array
      this.visit.ateliers.forEach(atelier => {
        const object = this.ateliers.find(x => x._id === atelier);
        ateliersarray.push(object);
      });

      return ateliersarray;
    },
    computedTime() {
      // calculate how long each user has been logged in
      const timegetin = new Date(this.visit.date);
      const now = new Date();
      const timepassed = new Date(now.getTime() - timegetin.getTime());
      const diff_hours = timepassed.getHours() - 1;
      let diff_mins = timepassed.getMinutes();

      if (diff_mins < 10) {
        diff_mins = '0' + diff_mins;
      }

      return {
        formatted: diff_hours + ':' + diff_mins,
        unformatted: timepassed.getTime()
      };
    }
  },
  mounted() {
    if (this.visit.paid) {
      this.paid = true;
    }
  }
};
</script>

<style></style>
