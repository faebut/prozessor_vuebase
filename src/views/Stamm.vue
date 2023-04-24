<template>
  <div>
    <h1 class="grey--text">Stammdaten</h1>
    <v-container class="my-5">
      <atelier-create />
      <atelier-list />
    </v-container>
  </div>
</template>

<script>
import AtelierList from '@/components/stammdaten/AtelierList';
import AtelierCreate from '@/components/stammdaten/AtelierCreate';

export default {
  name: 'Stammdaten',
  components: {
    AtelierList,
    AtelierCreate,
  },
};
</script>

<style scoped></style>
