<template>
  <v-container class="fill-height">
    <v-container>
      <v-row class="d-flex justify-center align-center mb-8 mt-1">
        <img :src="require('@/assets/img/logo-dex-blanco.svg')" alt="logo" height="70" />
      </v-row>
      <v-row class="d-flex justify-center align-center">
        <v-col xl="6" lg="6" md="7" sm="8" xs="12">
          <v-card elevation="1" class="elevation-2 leve">
            <v-card-text>
              <v-row>
                <template v-for="(item, key) of items">
                  <v-col :key="key" cols="12" sm="4" md="4" lg="4" class="text-center mx-auto">
                    <div class="d-flex justify-center pb-2 pt-8">
                      <v-img :src="require(`@/assets/img/${theme}/${item.icon}`)" max-width="80" max-height="80"></v-img>
                    </div>
                    <div class="text-center pb-1">
                      <span class="subtitle-1">{{ item.title }}</span>
                    </div>
                    <v-btn block text large color="primary" class="pl-8 pr-8 subtitle-1 font-weight-bold white--text" router :to="item.route">{{ item.nameButton }}</v-btn>
                  </v-col>
                </template>
              </v-row>
            </v-card-text>
            <v-card-actions class="white pa-0">
              <v-row class="ml-2">
                <v-col class="d-flex justify-start darkness--text"> I already have an account</v-col>
                <v-col class="d-flex justify-end">
                  <v-btn router text small color="primary" to="/" class="font-weight-bold pt-1 pb-1 mr-4">Sign In</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center align-center ma-4">
        <router-link class="font-italic font-weight-medium" to="/">Go to home page</router-link>
      </v-row>
    </v-container>
  </v-container>
</template>
<script>
export default {
  data: () => {
    return {
      title: 'Select Wallet Creation Type',
      theme: 'light',
      items: [
        {
          title: 'New account',
          nameButton: 'Create',
          icon: 'icon-add.svg',
          route: '/create-new-signup'
        },
        {
          title: 'From a Private Key',
          nameButton: 'Create',
          icon: 'icon-private-key.svg',
          route: '/create-from-privateKey'
        },
        {
          title: 'From a Wallet Backup',
          nameButton: 'Create',
          icon: 'icon-wallet-import.svg',
          route: '/create-from-wallet-backup'
        }
      ]
    }
  }
}
</script>
