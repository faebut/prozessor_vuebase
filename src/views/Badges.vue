<template>
  <div>
    <h1 class="grey--text">Badges</h1>
    <v-container class="my-5">
      <badge-create :users="users" />
      <badge-list />
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BadgeList from '@/components/badges/BadgeList';
import BadgeCreate from '@/components/badges/BadgeCreate';

export default {
  name: 'BadgesMain',
  components: {
    BadgeList,
    BadgeCreate
  },
  methods: {
    ...mapActions(['fetchUsers'])
  },
  computed: {
    ...mapGetters(['users'])
  },
  created() {
    this.fetchUsers();
  }
};
</script>

<style scoped></style>
