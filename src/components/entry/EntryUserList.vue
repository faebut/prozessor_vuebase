<template>
  <div>
    <h2>Besuchende</h2>
    <v-text-field
      label="Durchsuchen..."
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

    <v-card
      flat
      class="pa-3 mb-1"
      v-for="user in filteredUsers.pagedUsers"
      :key="user._id"
    >
      <v-layout row wrap>
        <v-flex xs2>
          <v-icon class="info--text">person</v-icon>
        </v-flex>

        <v-flex xs9>
          <div>{{ user.firstname }} {{ user.name }}, {{ user.city }}</div>
        </v-flex>

        <v-flex xs1>
          <entry-new :id="user._id" :partners="partners" :ateliers="ateliers" />
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
import EntryNew from '@/components/entry/EntryNew';

export default {
  name: 'UserList',
  components: {
    EntryNew,
  },
  data() {
    return {
      search: '',
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pages: 1,
      },
    };
  },
  methods: {
    ...mapActions(['fetchPartners', 'fetchUsers', 'fetchAteliers']),
    clearSearch() {
      this.search = '';
    },
  },
  computed: {
    ...mapGetters(['users', 'partners', 'ateliers', 'loggedIn']),
    filteredUsers() {
      const sortedUsers = this.users
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

      // filter logged in users from List
      const notLoggedIn = sortedUsers.filter((user) => {
        return (
          this.loggedIn.filter((userLoggedIn) => {
            return userLoggedIn._id == user._id;
          }).length == 0
        );
      });

      // Filter from searchbox
      const filterUsers = notLoggedIn.filter((user) => {
        return (
          user.name.toLowerCase().match(this.search.toLowerCase()) ||
          user.firstname.toLowerCase().match(this.search.toLowerCase()) ||
          user.city.toLowerCase().match(this.search.toLowerCase())
        );
      });

      // Pagination
      const pageSize = this.pagination.pageSize;
      const pages = Math.ceil(filterUsers.length / pageSize);

      const startIndex = (this.pagination.currentPage - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, filterUsers.length);

      const pagedUsers = filterUsers.slice(startIndex, endIndex);

      return {
        pagedUsers,
        pages,
      };
    },
  },
  created() {
    this.fetchUsers();

    // reload state of partners
    this.fetchPartners();

    // get Ateliers
    this.fetchAteliers();
  },
};
</script>

<style scoped></style>
