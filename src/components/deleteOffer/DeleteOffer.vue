<template>
  <div>
    <simple-table
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
        'type',
        'Assets',
        'Initial quantity',
        'Quantity Available',
        'price (XPX)',
        'Total (XPX)'
      ]
    }
  },
  computed: {
    ...mapGetters('offersStore', ['offerAll']),
    offerAlldata () {
      console.log(this.offerAll)
      return this.buildData(this.offerAll)
    }
  },
  components: {
    'simple-table': () => import('@/components/shared/SimpleTable')
  },
  methods: {
    action (item) {
      console.log(item)
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
        offerts = data.allOffers[type].map(f => {
          const initialQuantity = this.$generalService.amountFormatter(
            f.initialAmount.compact(),
            data.tableData.info.mosaicInfo[0].mosaicInfo
          )
          const quantityAvailable = this.$generalService.amountFormatter(
            f.amount.compact(),
            data.tableData.info.mosaicInfo[0].mosaicInfo
          )
          const initialCost = this.$generalService.amountFormatter(f.initialCost.compact(), '', 6)
          const price = f.price
          return {
            type: type,
            assets: data.tableData.info.text,
            initialQuantity: initialQuantity,
            quantityAvailable: quantityAvailable,
            price: price,
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
