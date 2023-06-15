<template>
  <div>
    <v-card flat class="pa-3 mb-1">
      <v-layout row wrap>
        <v-flex xs2 sm1>
          <div class="caption grey--text">No.</div>
          <div>{{ badge.number }}</div>
        </v-flex>
        <v-flex xs7 sm2>
          <div class="caption grey--text">UID</div>
          <div>{{ badge.uid }}</div>
        </v-flex>
        <v-flex xs3 sm1>
          <div class="caption grey--text">Genutzt</div>
          <span v-if="!badge.inUse"
            ><v-icon color="secondary">cancel</v-icon></span
          >
          <span v-if="badge.inUse">
            <v-icon v-if="badge.extern" color="warning">check_circle</v-icon>
            <v-icon
              v-else-if="badgeUser.member || badgeUser.validAbo"
              color="success"
              >check_circle</v-icon
            >
            <v-icon v-else color="error">info</v-icon>
          </span>
        </v-flex>

        <v-flex xs6 sm6 md3>
          <div class="caption grey--text">Benutzer</div>
          <div v-if="badge.inUse">
            {{ badgeUser.firstname }} {{ badgeUser.name }}, {{ badgeUser.city }}
          </div>
        </v-flex>

        <v-flex xs6 sm6 md3>
          <div class="caption grey--text">Nutzungszweck</div>
          <div v-if="badge.inUse && badge.extern">{{ badge.purpose }}</div>
        </v-flex>

        <v-flex xs12 sm6 md2>
          <center>
            <badge-edit :id="badge._id" :users="users" />
            <v-btn fab small color="error" @click="deleteBadge(badge._id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </center>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import BadgeEdit from '@/components/badges/BadgeEdit';

export default {
  name: 'BadgeListing',
  props: ['badge', 'users'],
  components: {
    BadgeEdit,
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['deleteBadge']),
  },
  computed: {
    badgeUser() {
      let user = {
        firstname: '',
        name: '',
        city: '',
      };

      if (this.badge.inUse) {
        if (!this.badge.extern) {
          user = this.users.find((u) => u._id === this.badge.ownerInternID);

          if (user.buydate) {
            const today = new Date();
            const buydate = new Date(user.buydate);

            const difference = today - buydate;

            const total_seconds = parseInt(Math.floor(difference / 1000));
            const total_minutes = parseInt(Math.floor(total_seconds / 60));
            const total_hours = parseInt(Math.floor(total_minutes / 60));
            const days = parseInt(Math.floor(total_hours / 24));
            const restdays = 365 - days;

            if (restdays > 0) {
              user.duration = restdays;
              user.validAbo = true;
            } else if (restdays < 0) {
              user.validAbo = false;
              user.duration = restdays;
            } else {
              user.validAbo = false;
            }
          }
        } else {
          user.firstname = this.badge.ownerFirstName;
          user.name = this.badge.ownerLastName;
          user.city = this.badge.ownerCity;
        }
      }

      return user;
    },
  },
};
</script>

<style scoped></style>
