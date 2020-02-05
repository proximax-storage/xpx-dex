<template>
  <div>
    <h1 class="body-1 orange--text font-italic light--text">Fact</h1>
    <v-carousel cycle height="100%" class="pa-2 ma-0 pt-0" :hide-delimiters="showArrowsHover" :show-arrows-on-hover="showArrowsHover">
      <v-row>
        <v-col>
          <v-carousel-item heigth="100%">
            <v-row>
              <fact-card v-for="(item, index) in cards" :key="index" :name="item.name" :bet="item.bet" :tags="item.tags"/>
            </v-row>
          </v-carousel-item>

          <v-carousel-item heigth="100%">
            <v-row>
              <fact-card v-for="(item, index) in cards" :key="index" :name="item.name" :bet="item.bet" :tags="item.tags"/>
            </v-row>
          </v-carousel-item>
        </v-col>
      </v-row>
    </v-carousel>
  </div>
</template>

<script>
import FactCard from './fact-card'
import proposalData from '../../JSON/dashboard/proposal.json'

export default {
  name: 'Proposal',

  components: {
    FactCard
  },

  data () {
    return {
      showArrowsHover: true
    }
  },

  computed: {
    cards () {
      return proposalData
    }
  }
}
</script>
