<template>
  <div>
    <assets-info-balance />

    <assets-list />
  </div>
</template>
<script>
export default {
  components: {
    'assets-info-balance': () => import('@/components/assetsMyWallet/AssetInfoBalance'),
    'assets-list': () => import('@/components/assetsMyWallet/AssetsList')
  }
}
</script>
