<template>
  <div>
    <!-- {{offerAlldata}} -->
    <simple-table
      v-if="offerAlldata"
      :dataTh="dataTh"
      :type="'delete'"
      :dataTable="offerAlldata"
      :mosaicInfo="[]"
      @action="action"
    ></simple-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      dataTh: [
        'Type',
        'Assets',
        'Initial Quantity',
        'Quantity Available',
        'Total (XPX)'
      ]
    }
  },
  computed: {
    ...mapGetters('offersStore', ['offerAll']),
    ...mapGetters('accountStore', ['currentAccount']),
    offerAlldata () {
      return this.buildData(this.offerAll)
    }
  },
  components: {
    'simple-table': () => import('@/components/shared/SimpleTable')
  },
  methods: {
    action (exchange) {
      this.$store.commit('mosaicExchange/SET_EXCHANGE_DELETE', exchange)
      this.$router.push({ path: '/deleteOffer' })
    },
    buildData (data = []) {
      let offerts = []
      if (data.length > 0) {
        for (let x of data) {
          const buy = this.typeBuildData('buy', x)[0]
          const sell = this.typeBuildData('sell', x)[0]
          if (buy) offerts.push(buy)
          if (sell) offerts.push(sell)
        }
        return offerts
      }
    },
    typeBuildData (type = null, data = []) {
      let offerts = []
      if (data.allOffers[type] && data.allOffers[type].length > 0) {
        offerts = data.allOffers[type]
          .filter(x => x.owner.publicKey === this.currentAccount.publicKey)
          .map(f => {
            const initialQuantity = this.$generalService.amountFormatter(
              f.initialAmount.compact(),
              data.tableData.info.mosaicInfo[0].mosaicInfo.properties.divisibility
            )
            const quantityAvailable = this.$generalService.amountFormatter(
              f.amount.compact(),
              data.tableData.info.mosaicInfo[0].mosaicInfo.properties.divisibility
            )
            const initialCost = this.$generalService.amountFormatter(f.initialCost.compact(), 6)
            console.log(f)
            // const price = f.bitPrice
            return {
              type: type,
              assets: data.tableData.info.text,
              initialQuantity: initialQuantity,
              quantityAvailable: quantityAvailable,
              // price: price,
              initialCost: initialCost,
              exchange: f
            }
          })
      }
      return offerts
    }
  }
}
</script>
