<template>
  <v-col class="pa-3 12">
    <account-edit />
    <account-info />
    <account-backup />
  </v-col>
</template>
<script>
export default {

  components: {
    'account-edit': () => import('@/components/myWalletInfo/AccountEdit'),
    'account-info': () => import('@/components/myWalletInfo/AccountInfo'),
    'account-backup': () => import('@/components/myWalletInfo/AccountBackup')
  }
}
</script>
