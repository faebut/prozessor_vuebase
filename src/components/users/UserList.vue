<template>
  <div>
    <v-text-field
      label="Suche nach Name, Vorname oder Ort..."
      prepend-icon="search"
      clearabel
      v-model="search"
      type="text"
    >
      <template v-slot:append-outer>
        <v-btn flat icon color="primary" @click="clearSearch">
          <v-icon>cancel</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-card flat class="pa-3 mb-4">
      <v-card-title class="headline">Suchfilter</v-card-title>
      <v-layout row wrap>
        <v-flex xs6 md3>
          <v-checkbox
            v-model="filterAbo"
            label="Abonnement"
            color="primary"
            value="abo"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-if="filterAbo && !filterAboInvalid"
            v-model="filterAboValid"
            label="Abo gültig"
            color="primary"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-if="filterAbo && !filterAboValid"
            v-model="filterAboInvalid"
            label="Abo abgelaufen"
            color="primary"
            hide-details
          ></v-checkbox>
        </v-flex>
        <v-flex xs6 md3>
          <v-checkbox
            v-model="filterMember"
            label="Betriebsgruppe"
            color="primary"
            value="member"
            hide-details
          ></v-checkbox>
        </v-flex>
        <v-flex xs6 md3>
          <v-checkbox
            v-model="filterBadge"
            label="Badge"
            color="primary"
            value="badge"
            hide-details
          ></v-checkbox>
        </v-flex>
        <v-flex xs6 md3>
          <v-checkbox
            v-model="filterPartners"
            label="Partner"
            color="primary"
            value="partner"
            hide-details
          ></v-checkbox>
        </v-flex>
        <v-flex xs12 sm6 md3>
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Sortieren nach"
          ></v-select
          ><br />
          <v-select
            v-model="sortDir"
            :items="sortDirOptions"
            label="Richtung"
          ></v-select>
        </v-flex>

        <v-flex xs12>
          <center>
            <v-btn class="primary">
              <export-excel
                :data="filteredUsers.sortedSortedUsers"
                :fields="filterExport"
                worksheet="Besuchende"
                name="Datenbank.xls"
                >Download Excel
              </export-excel></v-btn
            >
          </center>
        </v-flex>
      </v-layout>
    </v-card>

    <v-card
      flat
      class="pa-3 mb-1"
      v-for="user in filteredUsers.pagedUsers"
      :key="user._id"
    >
      <v-layout row wrap>
        <v-flex xs5 sm6 md3>
          <div class="caption grey--text">Name</div>
          <div>{{ user.firstname }} {{ user.name }}</div>
        </v-flex>
        <v-flex xs3 sm6 md1>
          <div class="caption grey--text">Ort</div>
          <div>{{ user.city }}</div>
        </v-flex>
        <v-flex xs3 sm3 md1>
          <div class="caption grey--text">"Abo"</div>
          <div
            v-if="user.aboValidity >= 30"
            class="font-weight-bold green--text"
          >
            {{ user.aboValidity }} Tage
          </div>
          <div
            v-else-if="user.aboValidity <= 0"
            class="font-weight-bold red--text"
          >
            {{ user.aboValidity }} Tage
          </div>
          <div
            v-else-if="user.aboValidity <= 30"
            class="font-weight-bold orange--text"
          >
            {{ user.aboValidity }} Tage
          </div>
          <div v-else>kein Abo</div>
        </v-flex>
        <v-flex xs1 sm3 md1>
          <div class="caption grey--text">Badge</div>
          <div>
            <span v-if="user.badge"><v-icon color="success">key</v-icon></span>
          </div>
        </v-flex>
        <v-flex xs12 sm6 md3>
          <div class="caption grey--text">E-Mail</div>
          <div>{{ user.email }}</div>
        </v-flex>

        <v-flex xs12 sm6 md3>
          <center>
            <user-info :id="user._id" />

            <user-edit :id="user._id" />

            <v-btn fab small color="error" @click="deleteUser(user._id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </center>
        </v-flex>
      </v-layout>
    </v-card>

    <div v-if="filteredUsers.pages > 1" class="text-xs-center">
      <v-pagination
        v-model="pagination.currentPage"
        :length="filteredUsers.pages"
        color="primary"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import UserEdit from '@/components/users/UserEdit';
import UserInfo from '@/components/users/UserInfo';

export default {
  name: 'UserList',
  components: {
    UserEdit,
    UserInfo,
  },
  data() {
    return {
      search: '',
      filterAbo: false,
      filterAboValid: false,
      filterAboInvalid: false,
      filterMember: false,
      filterBadge: false,
      filterPartners: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pages: 1,
      },
      // filter for Export
      filterExport: {
        Email: 'email',
        Vorname: 'firstname',
        Name: 'name',
        Adresse: 'address',
        PLZ: 'postcode',
        Ort: 'city',
        Geburtstag: 'birthdate',
        Telefon: 'phone',
        Betriebsgruppe: 'member',
        Abo: 'buydate',
        Nutzungsvereinbarung: 'agreement',
      },
      // sorting
      sortOptions: ['Name', 'Ort', 'Abo'],
      sortBy: 'Name',
      sortDirOptions: ['Aufsteigend', 'Absteigend'],
      sortDir: 'Aufsteigend',
    };
  },
  methods: {
    ...mapActions(['fetchUsers', 'fetchBadges', 'deleteUser']),
    clearSearch() {
      this.search = '';
    },
  },
  computed: {
    ...mapGetters(['users', 'badges']),
    filteredBadges() {
      let filterBadges = [];

      for (let i = 0; i < this.badges.length; i++) {
        if (this.badges[i].ownerInternID) {
          filterBadges.push(this.badges[i].ownerInternID);
        }
      }

      return filterBadges;
    },
    filteredUsers() {
      let sortedUsers = null;
      if (this.sortDir === 'Aufsteigend') {
        sortedUsers = this.users
          .slice()
          .sort((a, b) =>
            a.firstname.toLowerCase() > b.firstname.toLowerCase()
              ? 1
              : a.firstname.toLowerCase() === b.firstname.toLowerCase()
              ? a.name.toLowerCase() > b.name.toLowerCase()
                ? 1
                : -1
              : -1
          );
      } else {
        sortedUsers = this.users
          .slice()
          .sort((b, a) =>
            a.firstname.toLowerCase() > b.firstname.toLowerCase()
              ? 1
              : a.firstname.toLowerCase() === b.firstname.toLowerCase()
              ? a.name.toLowerCase() > b.name.toLowerCase()
                ? 1
                : -1
              : -1
          );
      }

      const dateNow = new Date().setHours(0, 0, 0, 0);

      sortedUsers.forEach((user) => {
        if (user.buydate) {
          // check if there is an abonnement and if it's still valid
          const dateAbo = new Date(user.buydate);
          const diffTime = Math.abs(dateNow - dateAbo);
          const diffDays = Math.ceil(366 - diffTime / (1000 * 60 * 60 * 24));
          // how many days is it still valid or already overdue
          user.aboValidity = diffDays;
        }
        user.badge = this.filteredBadges.includes(user._id);
      });

      // Filters from filtercard

      var prefilterUsers = sortedUsers;

      // check validity of Abo

      if (this.filterAbo) {
        prefilterUsers = prefilterUsers.filter((user) => {
          if (this.filterAboValid) {
            return user.aboValidity >= 0;
          } else if (this.filterAboInvalid) {
            return user.aboValidity <= 0;
          } else {
            return user.buydate;
          }
        });
      }

      if (this.filterMember) {
        prefilterUsers = prefilterUsers.filter((user) => {
          return user.member;
        });
      }

      if (this.filterBadge) {
        prefilterUsers = prefilterUsers.filter((user) =>
          this.filteredBadges.includes(user._id)
        );
      }

      if (this.filterPartners) {
        prefilterUsers = prefilterUsers.filter((user) => {
          return user.partners;
        });
      }

      // Filter from searchbox
      const filterUsers = prefilterUsers.filter((user) => {
        return (
          user.name.toLowerCase().match(this.search.toLowerCase()) ||
          user.firstname.toLowerCase().match(this.search.toLowerCase()) ||
          user.city.toLowerCase().match(this.search.toLowerCase())
        );
      });

      // conditional sorting done here.

      let sortedSortedUsers = filterUsers;

      if (this.sortBy === 'Ort') {
        if (this.sortDir === 'Aufsteigend') {
          sortedSortedUsers = filterUsers
            .slice()
            .sort((a, b) =>
              a.city.toLowerCase() > b.city.toLowerCase()
                ? 1
                : a.city.toLowerCase() === b.city.toLowerCase()
                ? a.firstname.toLowerCase() > b.firstname.toLowerCase()
                  ? 1
                  : a.firstname.toLowerCase() === b.firstname.toLowerCase()
                  ? a.name.toLowerCase() > b.name.toLowerCase()
                    ? 1
                    : -1
                  : -1
                : -1
            );
        } else {
          sortedSortedUsers = filterUsers
            .slice()
            .sort((b, a) =>
              a.city.toLowerCase() > b.city.toLowerCase()
                ? 1
                : a.city.toLowerCase() === b.city.toLowerCase()
                ? a.firstname.toLowerCase() > b.firstname.toLowerCase()
                  ? 1
                  : a.firstname.toLowerCase() === b.firstname.toLowerCase()
                  ? a.name.toLowerCase() > b.name.toLowerCase()
                    ? 1
                    : -1
                  : -1
                : -1
            );
        }
      } else if (this.sortBy === 'Abo') {
        if (this.sortDir === 'Aufsteigend') {
          sortedSortedUsers = filterUsers
            .slice()
            .sort((a, b) =>
              a.aboValidity > b.aboValidity
                ? 1
                : a.aboValidity === b.aboValidity
                ? a.firstname.toLowerCase() > b.firstname.toLowerCase()
                  ? 1
                  : a.firstname.toLowerCase() === b.firstname.toLowerCase()
                  ? a.name.toLowerCase() > b.name.toLowerCase()
                    ? 1
                    : -1
                  : -1
                : -1
            );
        } else {
          sortedSortedUsers = filterUsers
            .slice()
            .sort((b, a) =>
              a.aboValidity > b.aboValidity
                ? 1
                : a.aboValidity === b.aboValidity
                ? a.firstname.toLowerCase() > b.firstname.toLowerCase()
                  ? 1
                  : a.firstname.toLowerCase() === b.firstname.toLowerCase()
                  ? a.name.toLowerCase() > b.name.toLowerCase()
                    ? 1
                    : -1
                  : -1
                : -1
            );
        }
      }

      // Pagination
      const pageSize = this.pagination.pageSize;
      const pages = Math.ceil(sortedSortedUsers.length / pageSize);

      const startIndex = (this.pagination.currentPage - 1) * pageSize;
      const endIndex = Math.min(
        startIndex + pageSize,
        sortedSortedUsers.length
      );

      const pagedUsers = sortedSortedUsers.slice(startIndex, endIndex);

      return {
        pagedUsers,
        pages,
        sortedSortedUsers,
      };
    },
  },
  created() {
    // reload state of users
    this.fetchUsers();
    this.fetchBadges();
  },
};
</script>

<style scoped></style>
