<template>
  <span>
    <v-toolbar app flat max-width="1200" class="background">
      <v-toolbar-side-icon
        @click="drawer = !drawer"
        class="grey--text"
      ></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Database</span>
        <span>Prozessor</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn v-if="loggedIn" @click="onLogout" flat color="grey">
        <span>Sign Out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" class="white darkgrey--text">
      <v-layout column align-center>
        <v-flex class="mt-5">
          <img height="200px" src="../assets/2_black.png" alt />
        </v-flex>
      </v-layout>
      <v-list class="mt-3">
        <template v-for="(item, index) in items">
          <v-list-tile
            v-if="item.show || loggedIn"
            :key="index"
            router
            :to="item.link"
            active-class="grey lighten-2"
          >
            <v-list-tile-action>
              <v-icon class="darkgrey--text">{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>{{ item.title }}</v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
  </span>
</template>

<script>
import auth from '../store/modules/auth';
import { mapActions } from 'vuex';

export default {
  name: 'AppNavigation',
  data() {
    return {
      appTitle: 'Prozessor UserDatabase',
      drawer: false,
      items: [
        { icon: 'dashboard', title: 'Home', link: '/', show: true },
        { icon: 'folder', title: 'Eingang', link: '/entry', show: false },
        { icon: 'person', title: 'Besuchende', link: 'users', show: false },
        { icon: 'group', title: 'Partner', link: '/partners', show: false },
        {
          icon: 'assignment',
          title: 'Stammdaten',
          link: '/stamm',
          show: false
        },
        {
          icon: 'insert_chart',
          title: 'Statistik',
          link: '/statistics',
          show: false
        },
        { icon: 'build', title: 'Experten', link: '/experts', show: false }
      ]
    };
  },
  methods: {
    ...mapActions(['logout']),
    onLogout() {
      this.logout();
    }
  },
  computed: {
    loggedIn() {
      // return the value of the idToken
      return auth.state.idToken;
    }
  }
};
</script>

<style scoped></style>
