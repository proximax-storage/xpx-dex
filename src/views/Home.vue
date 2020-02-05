<template>
  <div class="home">
    <proposal/>
    <prediction/>
    <fact/>
  </div>
</template>

<script>
import Proposal from '@/components/dashboard/proposal.vue'
import Prediction from '@/components/dashboard/prediction.vue'
import Fact from '@/components/dashboard/fact.vue'

export default {
  name: 'home',

  components: {
    Proposal,
    Prediction,
    Fact
  }
}
</script>
