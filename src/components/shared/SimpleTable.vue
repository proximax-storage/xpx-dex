<template>
  <v-row class="ml-1 pt-0">
    <v-col cols="12">
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr style="border:0">
              <template v-for="i in dataTh">
                <th
                  :key="i"
                  style="border:0"
                  class="text-left subtitle-1 font-weight-bold"
                  v-html="i"
                ></th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr
              class="pr-3 pl-3"
              style="border:0"
              v-for="(n, commentIndex) in commentsToShow"
              :key="commentIndex"
            >
              <template v-if="commentIndex < dataTable.length">
                <template v-for="i in Object.keys( dataTable[commentIndex])">
                  <!-- {{i}} -->
                  <td v-if="i !== 'exchange'" class="pr-3" style="border:0" :key="i" v-html="dataTable[commentIndex][i]"></td>
                </template>

                <td class="pr-3" style="border:0">
                  <v-chip
                    :color="typeOfferColor"
                    small
                    class="ma-2 text-capitalize text-center"
                    @click="triggerClick(dataTable[commentIndex])"
                  >
                    <span class="pa-2 white--text">{{ type }}</span>
                  </v-chip>
                </td>
              </template>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
    <v-col cols="12" class="d-flex justify-center align-center">
      <a
        class="title font-weight-regular text-left primary--text"
        v-if="
          commentsToShow < dataTable.length || dataTable.length > commentsToShow
        "
        @click="commentsToShow += 5"
      >Load more</a>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ['dataTh', 'dataTable', 'type', 'mosaicInfo'],
  data: () => ({
    typeOfferColor: null,
    commentsToShow: 5
  }),
  watch: {
    dataTable: function (newExrDay) {
      this.commentsToShow = 5
    },
    type: {
      immediate: true,
      handler (value) {
        this.typeOfferColor = this.typeAction(value)
      }
    },
    mosaicInfo: {
      immediate: true,
      handler (value) {
        this.mosaicInfo = value
      }
    }
  },
  created () {
    this.typeOfferColor = this.typeAction(this.type)
  },
  methods: {
    triggerClick (item) {
      this.$emit('action', item)
    },
    typeAction (type = null) {
      this.type = type
      if (type === 'buy') {
        return 'dim'
      } else if (type === 'sell') {
        return 'pin'
      } else if (type === 'delete') {
        return 'error'
      }
    }
  }
}
</script>
