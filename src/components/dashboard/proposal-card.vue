<template>
  <v-card class="pa-1 ma-auto" max-width="344" default width="18%" color="black">
    <v-list color="black">
      <div class="ma-0 pa-0">
        <v-card color="grey darken-3 pa-1 body-1 text" width="100%" max-height="45" style="overflow: hidden">
          <p class="body-2 ma-0 white--text">{{ name }}</p>
        </v-card>
      </div>

      <div class="ma-0 mt-2 pa-1">
        <div color="pa-0 ma-0">
          <p class="ma-0" style="font-size: 10px">{{ bet }}</p>
        </div>
      </div>

      <div class="ma-0 mt-0">
        <v-row class="d-flex justify-end">
          <v-col class="pa-0">
            <div class="d-flex align-center justify-space-around">
              <div class="d-flex justify-space-between">
                <v-chip
                  class="ma-0 chip2 smallfont font-italic pl-2 pr-2"
                  style="text-transform: capitalize; height: 20px">
                  {{ tags.sport }}
                </v-chip>
                <v-chip
                  class="ma-0 ml-1 pl-2 pr-2 chip2 smallfont font-italic"
                  style="text-transform: capitalize; height: 20px">
                  {{ tags.date }}
                </v-chip>
              </div>
              <div>
                <v-btn icon>
                  <v-icon color="secondary">mdi-thumb-up</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'ProposalCard',

  props: {
    name: String,
    bet: String,
    tags: Object
  }
}
</script>
