<template>
  <v-card flat class="pa-3 mb-1">
    <v-layout row wrap>
      <v-flex xs2>
        <v-icon class="info--text">person</v-icon>
      </v-flex>

      <v-flex xs9>
        <div>{{ user.firstname }} {{ user.name }}</div>
      </v-flex>

      <v-flex xs1>
        <!-- Button für löschen -->
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'EntryLoggedInUser',
  props: ['user', 'visit']
};
</script>

<style></style>
