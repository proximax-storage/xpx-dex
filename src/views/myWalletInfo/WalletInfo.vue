<template>
  <v-col class="pa-3">
    <v-row>
      <v-col cols="12" class="headline font-weight-regular text-left primary--text">Account details</v-col>
    </v-row>
    <!-- mosaicInfo -->
    <v-row class="pt-4">
      <v-col sm="7" md="7" lg="9" col="9" class="pt-0">
        <v-tabs v-model="tab" background-color="transparent" color="primary" grow slider-size="4">
          <div
            class="v-tabs-slider-wrapper"
            style="height: 4px; width: 100%; color: #efe4d9; z-index:0"
          >
            <div class="v-tabs-slider"></div>
          </div>
          <v-tab
            class="title text-capitalize font-weight-bold"
            v-for="item in arrayItems"
            :key="item.item"
            :value="item.name"
          >{{ item.name }}</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="item in arrayItems" :key="item.item">
            <template v-if="tab === 1">
              <delete-offer-list/>
            </template>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      tab: 1,
      arrayItems: [
        // {
        //   items: 'assets',
        //   name: 'Assets',
        //   index: 0
        // },
        // {
        //   items: 'activity',
        //   name: 'Activity',
        //   index: 1
        // },
        {
          items: 'info',
          name: 'Info',
          index: 0
        },
        {
          items: 'myOffers',
          name: 'My offers',
          index: 1
        }
      ]
    }
  },
  computed: {
    ...mapGetters('offersStore', ['offerAll'])
  },
  components: {
    'delete-offer-list': () => import('@/components/deleteOffer/DeleteOfferList')
  },
  methods: {
    filterItems (param = null, arrayItems = []) {
      const value = arrayItems.filter(x => x.index === param)[0]
      return value
    },
    action (item) {
      console.log(item)
    }
  },
  beforeMount () {
    const item = this.filterItems(this.$route.query.item, this.arrayItems)
    this.tab = item.index
  }
}
</script>
