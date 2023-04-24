<template>
  <div>
    <h1 class="grey--text">Partner*innen</h1>
    <v-container class="my-5">
      <partner-create />
      <partner-list />
    </v-container>
  </div>
</template>

<script>
import PartnerCreate from '@/components/partners/PartnerCreate';
import PartnerList from '@/components/partners/PartnerList';

export default {
  name: 'Partners',
  components: {
    PartnerCreate,
    PartnerList,
  },
};
</script>

<style scoped></style>
