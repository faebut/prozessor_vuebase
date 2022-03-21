<template>
  <div>
    <badge-listing v-for="badge in badges" :key="badge._id" :badge="badge" />
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
    ...mapGetters(['badges'])
  },
  created() {
    this.fetchBadges();
  }
};
</script>

<style scoped></style>
