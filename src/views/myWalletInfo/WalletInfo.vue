<template>
  <v-col class="pa-3">
    <v-row>
      <v-col cols="12" class="headline font-weight-regular text-left primary--text">Account details</v-col>
    </v-row>
    <!-- mosaicInfo -->
    <v-row class="pt-4">
      <!-- <v-col sm="7" md="7" lg="10" col="10" class="pt-0"> -->
      <v-col sm="12" md="12" lg="12" col="12" class="pt-0">
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
            <template v-if="tab === 0">
              <!-- <account-setting/> -->
              <assets-info />
            </template>
            <template v-if="tab === 1">
              <!-- activity -->
              <!-- <delete-offer-list /> -->
            </template>
            <template v-if="tab === 2">
              <account-setting />
            </template>
            <template v-if="tab === 3">
              <delete-offer-list />
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
      tab1: 0,
      arrayItems: [
        {
          items: 'assets',
          name: 'Assets',
          index: 0
        },
        {
          items: 'activity',
          name: 'Activity',
          index: 1
        },
        {
          items: 'info',
          name: 'Info',
          index: 2
        },
        {
          items: 'myOffers',
          name: 'My offers',
          index: 3
        }
      ]
    }
  },
  computed: {
    ...mapGetters('offersStore', ['offerAll']),
    tab: {
      get () {
        return this.indexTab(this.$route.query.item)
      },
      set (value) {
        this.activity('myWallet', value)
      }
    }
  },
  components: {
    'delete-offer-list': () => import('@/components/deleteOffer/DeleteOfferList'),
    'assets-info': () => import('@/components/assetsMyWallet/AssetInfo'),
    'account-setting': () => import('@/components/myWalletInfo/AccountSetting')
  },
  methods: {
    activity (action, item) {
      this.$router.push({ path: `${action}`, query: { item: item } }).catch(e => {})
    },

    filterItems (param = null, arrayItems = []) {
      const value = arrayItems.filter(x => x.index === param)[0]
      return value
    },
    indexTab (items) {
      const item = this.filterItems(items, this.arrayItems)
      return item.index
    }
  }
}
</script>
