<template>
  <div>
    <badge-listing
      v-for="badge in sortedBadges"
      :key="badge._id"
      :badge="badge"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BadgeListing from './BadgeListing.vue';

export default {
  name: 'BadgeList',
  components: {
    BadgeListing
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['fetchBadges', 'fetchUsers'])
  },
  computed: {
    ...mapGetters(['badges']),
    // sort badges by number
    sortedBadges() {
      const unsortBadges = this.badges;

      const sortBadges = unsortBadges.sort((a, b) => a.number - b.number);

      return sortBadges;
    }
  },
  created() {
    this.fetchBadges();
  }
};
</script>

<style scoped></style>
