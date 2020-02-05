<template>
  <v-row justify="center" align="center">
    <v-col cols="10" justify="center" align="center" class="pt-12">
      <span class="leve--text font-italic font-weight-bold display-3">Sports</span>
      <span class="primary--text font-italic font-weight-bold display-3">Bet</span>
    </v-col>
    <v-col cols="12" sm="8" md="6" lg="6">
      <v-card elevation="10" class="pb-10">
        <v-card-title class="title font-italic font-weight-medium primary--text">{{title}}</v-card-title>
        <v-card-subtitle class="leve--text pa-0 pl-4">Has been created succesfully</v-card-subtitle>
        <v-row>
          <v-col cols="11" class="mx-auto pt-0">
            <v-row>
              <v-col cols="10" class="mx-auto">
                <span class="body-1 leve--text">Adress:</span>
                <br>
                <span class="body-2 d-flex leve--text">{{address}}</span>
              </v-col>
              <!-- Icon -->
              <v-col cols="2" class="text-right pt-7">
                <v-btn text icon @click="doCopy('Address', address)">
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10" class="mx-auto">
                <span class="body-1 leve--text">Private key:</span>
                <br>
                <span class="body-2 d-flex leve--text">{{privateKey}}</span>
              </v-col>
              <!-- Icon -->
              <v-col cols="2" class="text-right pt-7">
                <v-btn text icon @click="doCopy('Private key', privateKey)">
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ['walletInfo'],
  data: () => {
    return {
      address: '',
      privateKey: '',
      title: 'My account name,'
    }
  },
  beforeMount () {
    const walletInfo = this.walletInfo.data
    this.address = walletInfo.accounts[0].address.pretty()
    this.privateKey = this.walletInfo.pvk
    console.log('walletInfo', walletInfo)
  }
}
</script>
