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
          <span v-if="badge.inUse"
            ><v-icon :color="badge.extern ? 'error' : 'success'"
              >check_circle</v-icon
            ></span
          >
        </v-flex>

        <v-flex xs6 sm6 md3>
          <div class="caption grey--text">Benutzer</div>
          <div v-if="badge.inUse">
            {{ user.firstname }} {{ user.name }}, {{ user.city }}
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
import { mapGetters, mapActions } from 'vuex';
import BadgeEdit from '@/components/badges/BadgeEdit';

export default {
  name: 'BadgeListing',
  props: ['badge'],
  components: {
    BadgeEdit
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['deleteBadge'])
  },
  computed: {
    ...mapGetters(['users']),
    user() {
      let user = {
        firstname: '',
        name: '',
        city: ''
      };

      if (this.badge.inUse) {
        if (!this.badge.extern) {
          user = this.users.filter(
            user => user._id === this.badge.ownerInternID
          )[0];
        } else {
          user.firstname = this.badge.ownerFirstName;
          user.name = this.badge.ownerLastName;
          user.city = this.badge.ownerCity;
        }
      }

      return user;
    }
  }
};
</script>

<style scoped></style>
