<template>
  <v-app class="background">
    <alert-snackbar />
    <app-navigation />

    <v-content class="mx-4" transition="slide-x-transition">
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import AppNavigation from '@/components/AppNavigation';
import AlertSnackbar from '@/components/AlertSnackbar';

export default {
  name: 'App',
  components: {
    AppNavigation,
    AlertSnackbar
  }
};
</script>

<style>
h1,
h2 {
  font-weight: 300;
  color: gray;
}
</style>
