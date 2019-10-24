<template>
  <div>
    <h1 class="grey--text">Eingang vom {{ computedDate }}</h1>

    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs12 md4>
          <entry-user-list />
        </v-flex>
        <v-flex xs12 md1></v-flex>
        <v-flex xs12 md7>
          <entry-overview :date="computedDate" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import EntryUserList from '@/components/entry/EntryUserList';
import EntryOverview from '@/components/entry/EntryOverview';
import format from 'date-fns/format';
import locales from 'date-fns/locale/de';

export default {
  name: 'Entry',
  components: {
    EntryUserList,
    EntryOverview
  },
  computed: {
    computedDate() {
      const date = new Date();

      return date ? format(date, 'DD. MMMM YYYY', { locale: locales }) : '';
    }
  }
};
</script>

<style scoped></style>
