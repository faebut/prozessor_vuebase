<template>
  <div>
    <h1 class="grey--text">
      Willkommen bei der Benutzerdatenbank des Prozessors. Bitte logge dich ein
    </h1>
    <v-container class="my-5 text-xs-center">
      <v-form ref="form">
        <v-layout row wrap>
          <v-flex md6 sm12 class="px-2">
            <v-text-field
              v-model="email"
              :rules="[rules.required, rules.email]"
              label="E-Mail"
            ></v-text-field>
          </v-flex>
          <v-flex md6 sm12 class="px-2">
            <v-text-field
              v-model="password"
              :rules="[rules.required]"
              :type="'password'"
              label="Passwort"
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="mt-4 px-2">
            <v-btn color="success" dark @click="onSubmit">Login</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Home',
  data: () => ({
    email: '',
    password: '',
    // rules
    rules: {
      required: value => !!value || 'Bitte eingeben.',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'E-Mail ungültig.';
      }
    }
  }),
  methods: {
    ...mapActions(['login']),
    onSubmit() {
      const formData = {
        email: this.email,
        password: this.password
      };
      this.login({ email: formData.email, password: formData.password });
    }
  }
};
</script>

<style scoped></style>
