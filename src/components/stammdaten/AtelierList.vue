<template>
  <div class="mt-3">
    <v-card
      flat
      class="pa-3 mb-1"
      v-for="atelier in ateliers"
      :key="atelier._id"
    >
      <v-layout row wrap>
        <v-flex xs3>
          <div class="caption grey--text">Atelier/Werkstatt</div>
          <div>{{ atelier.name }}</div>
        </v-flex>
        <v-flex xs6>
          <div class="caption grey--text">Beschreibung</div>
          <div>{{ atelier.description }}</div>
        </v-flex>
        <v-flex xs3>
          <center>
            <atelier-edit :id="atelier._id" />
            <v-btn fab small color="error" @click="deleteAtelier(atelier._id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </center>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AtelierEdit from '@/components/stammdaten/AtelierEdit';

export default {
  name: 'AtelierList',
  components: {
    AtelierEdit
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['fetchAteliers', 'deleteAtelier'])
  },
  computed: {
    ...mapGetters(['ateliers'])
  },
  created() {
    this.fetchAteliers();
  }
};
</script>

<style scoped></style>
