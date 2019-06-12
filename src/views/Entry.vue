<template>
  <div>
    <h1 class="grey--text">Eingang</h1>

    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs12 md3>
          <entry-user-list/>
        </v-flex>
        <v-flex xs12 md3 class="ml-5">
          <entry-overview/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import EntryUserList from '@/components/entry/EntryUserList';
import EntryOverview from '@/components/entry/EntryOverview';
export default {
  name: 'Entry',
  components: {
    EntryUserList,
    EntryOverview
  }
};
</script>

<style scoped></style>
