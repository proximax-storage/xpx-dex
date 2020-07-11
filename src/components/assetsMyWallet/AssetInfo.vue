<template>
  <assets-info-balance />
</template>
<script>
export default {
  components: {
    'assets-info-balance': () => import('@/components/assetsMyWallet/AssetInfoBalance')
  }
}
</script>
