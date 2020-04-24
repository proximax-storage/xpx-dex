<template>
  <v-row justify="center" align="center">
    <v-col cols="8" justify="center" align="center" class="pt-2">
      <template v-for="(item, key) of arrayTitle">
        <!-- <span class="leve--text font-italic font-weight-bold display-3"   :key="key">Sports</span> -->
        <span class="font-italic font-weight-bold display-3" :key="key">{{ item.title }}</span>
        <!-- <span class="primary--text font-italic font-weight-bold display-3">Bet</span> -->
      </template>
    </v-col>
  </v-row>
</template>
<script>
export default {
  beforeMount () {
    this.arrayTitle = []
  },
  data: () => {
    return {
      arrayTitle: null
    }
  }
}
</script>
