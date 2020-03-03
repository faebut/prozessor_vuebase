<template>
  <div>
    <h1 class="grey--text">Willkommen bei der Benutzerdatenbank des Prozessors. Bitte logge dich ein</h1>
    <v-container class="my-5 text-xs-center">
      <div id="signin">
        <div class="signin-form">
          <form @submit.prevent="onSubmit">
            <div class="input">
              <label for="email">Mail</label>
              <input type="email" id="email" v-model="email" />
            </div>
            <div class="input">
              <label for="password">Password</label>
              <input type="password" id="password" v-model="password" />
            </div>
            <div class="submit">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <v-btn large flat class="success">Login</v-btn>
    </v-container>
  </div>
</template>

<script>
import axios from '../axios-auth';

export default {
  name: 'Home',
  data: () => ({
    email: '',
    password: ''
  }),
  methods: {
    onSubmit() {
      const formData = {
        email: this.email,
        password: this.password
      };
      console.log(formData),
        axios
          .post(
            '/accounts:signInWithPassword?key=AIzaSyAwcADep1pDUmKasNzaTu0bWDqH0Bj96mk',
            {
              email: formData.email,
              password: formData.password,
              returnSecureToken: true
            }
          )
          .then(res => console.log(res))
          .catch(error => console.log(error));
    }
  }
};
</script>

<style scoped></style>
