<template>
  <div>
    <h1 class="headline font-italic primary--text">Predictions</h1>
    <v-row class="pb-5">
      <prediction-card :name="cards[0].name" :bet="cards[0].bet" :tags="cards[0].tags"/>
      <prediction-card :name="cards[1].name" :bet="cards[1].bet" :tags="cards[1].tags"/>
      <prediction-card :name="cards[2].name" :bet="cards[2].bet" :tags="cards[2].tags"/>
      <prediction-card :name="cards[3].name" :bet="cards[3].bet" :tags="cards[3].tags"/>
      <prediction-card :name="cards[4].name" :bet="cards[4].bet" :tags="cards[4].tags"/>
      <prediction-card :name="cards[0].name" :bet="cards[0].bet" :tags="cards[0].tags"/>
    </v-row>
    <v-row class="pb-5">
      <prediction-card :name="cards[0].name" :bet="cards[0].bet" :tags="cards[0].tags"/>
      <prediction-card :name="cards[1].name" :bet="cards[1].bet" :tags="cards[1].tags"/>
      <prediction-card :name="cards[2].name" :bet="cards[2].bet" :tags="cards[2].tags"/>
      <prediction-card :name="cards[3].name" :bet="cards[3].bet" :tags="cards[3].tags"/>
      <prediction-card :name="cards[4].name" :bet="cards[4].bet" :tags="cards[4].tags"/>
      <prediction-card :name="cards[0].name" :bet="cards[0].bet" :tags="cards[0].tags"/>
    </v-row>
  </div>
</template>

<script>
import PredictionCard from './prediction-card'
import proposalData from '../../JSON/dashboard/proposal.json'

export default {
  name: 'Prediction',

  components: {
    PredictionCard
  },

  computed: {
    cards () {
      return proposalData
    }
  }
}
</script>
