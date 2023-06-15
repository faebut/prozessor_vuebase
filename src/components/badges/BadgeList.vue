<template>
  <div v-if="users.length > 0 && badges.length > 0">
    <badge-listing
      v-for="badge in sortedBadges"
      :key="badge._id"
      :badge="badge"
      :users="users"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BadgeListing from './BadgeListing.vue';

export default {
  name: 'BadgeList',
  props: ['users'],
  components: {
    BadgeListing,
  },
  methods: {
    ...mapActions(['fetchBadges']),
  },
  computed: {
    ...mapGetters(['badges']),
    // sort badges by number
    sortedBadges() {
      const unsortBadges = this.badges;

      const sortBadges = unsortBadges.sort((a, b) => a.number - b.number);

      return sortBadges;
    },
  },
  created() {
    this.fetchBadges();
  },
};
</script>

<style scoped></style>
