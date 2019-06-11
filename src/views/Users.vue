<template>
  <div>
    <h1 class="grey--text">Besucher*innen</h1>
    <v-container class="my-5">
      <user-create/>
      <user-list/>
    </v-container>
  </div>
</template>

<script>
import UserCreate from '@/components/users/UserCreate';
import UserList from '@/components/users/UserList';
export default {
  name: 'Users',
  components: {
    UserCreate,
    UserList
  }
};
</script>

<style scoped>
h1 {
  font-weight: 300;
  color: #fff;
  text-transform: uppercase;
}
</style>
