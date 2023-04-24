<template>
  <div>
    <v-text-field
      label="Durchsuchen..."
      prepend-icon="search"
      clearabel
      v-model="search"
      type="text"
    >
      <template v-slot:append-outer>
        <v-btn flat icon color="primary" @click="clearSearch">
          <v-icon>cancel</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-card
      flat
      class="pa-3 mb-1"
      v-for="partner in filteredPartners.pagedPartners"
      :key="partner._id"
    >
      <v-layout row wrap>
        <v-flex xs6 sm2>
          <div class="caption grey--text">Partner</div>
          <div>{{ partner.partner }}</div>
        </v-flex>
        <v-flex xs6 sm1>
          <div class="caption grey--text">Ort</div>
          <div>{{ partner.city }}</div>
        </v-flex>
        <v-flex xs6 sm3>
          <div class="caption grey--text">Adresse</div>
          <div>
            {{ partner.address }}
            <br />
            {{ partner.postcode }} {{ partner.city }}
          </div>
        </v-flex>
        <v-flex xs6 sm3>
          <div class="caption grey--text">Kontakt</div>
          <div>
            {{ partner.contactfirstname }} {{ partner.contactname }}
            <br />
            {{ partner.email }}
          </div>
        </v-flex>
        <v-flex xs12 sm3>
          <center>
            <partner-edit :id="partner._id" />
            <v-btn fab small color="error" @click="deletePartner(partner._id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </center>
        </v-flex>
      </v-layout>
    </v-card>

    <div v-if="filteredPartners.pages > 1" class="text-xs-center">
      <v-pagination
        v-model="pagination.currentPage"
        :length="filteredPartners.pages"
        color="primary"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PartnerEdit from '@/components/partners/PartnerEdit';

export default {
  name: 'PartnerList',
  components: {
    PartnerEdit,
  },
  data() {
    return {
      search: '',
      pagination: {
        currentPage: 1,
        pageSize: 5,
        pages: 1,
      },
    };
  },
  methods: {
    ...mapActions(['fetchPartners', 'deletePartner']),
    clearSearch() {
      this.search = '';
    },
  },
  computed: {
    ...mapGetters(['partners']),
    filteredPartners() {
      const sortedPartners = this.partners
        .slice()
        .sort((a, b) =>
          a.partner.toLowerCase() > b.partner.toLowerCase() ? 1 : -1
        );

      // Filter from searchbox
      const filterPartners = sortedPartners.filter((partner) => {
        return (
          partner.partner.toLowerCase().match(this.search.toLowerCase()) ||
          partner.city.toLowerCase().match(this.search.toLowerCase()) ||
          partner.contactname.toLowerCase().match(this.search.toLowerCase()) ||
          partner.contactfirstname
            .toLowerCase()
            .match(this.search.toLowerCase())
        );
      });

      // Pagination
      const pageSize = this.pagination.pageSize;
      const pages = Math.ceil(filterPartners.length / pageSize);

      const startIndex = (this.pagination.currentPage - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, filterPartners.length);

      const pagedPartners = filterPartners.slice(startIndex, endIndex);

      return {
        pagedPartners,
        pages,
      };
    },
  },
  created() {
    this.fetchPartners();
  },
};
</script>

<style scoped></style>
