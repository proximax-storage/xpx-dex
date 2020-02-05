<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="8" justify="center" align="center" class="pt-12">
        <span class="leve--text font-italic font-weight-bold display-3">Sports</span>
        <span class="primary--text font-italic font-weight-bold display-3">Bet</span>
      </v-col>
      <v-col cols="10" sm="8" md="7" lg="7" justify="center" align="center">
        <v-card elevation="10">
          <v-row>
            <template v-for="(item, key) of items">
              <v-col :key="key" cols="10" sm="6" md="6" lg="6" class="text-center mx-auto pb-12">
                <div class="d-flex justify-center pb-2 pt-8">
                  <v-img
                    :src="require(`@/assets/img/${theme}/${item.icon}`)"
                    width="45"
                    height="45"
                    max-width="45"
                    max-height="45"
                  ></v-img>
                </div>
                <div class="text-center pb-1">
                  <span class="leve--text subtitle-1">{{item.title}}</span>
                </div>
                <v-btn
                  rounded
                  color="primary"
                  class="pl-8 pr-8 body-2 darkness--text"
                  router
                  :to="item.route"
                >{{item.nameButton}}</v-btn>
              </v-col>
            </template>
          </v-row>
          <v-card-actions class="leve pt-0 pb-0">
            <v-row class="darkness--text">
              <v-col class="d-flex justify-start ma-2">I'm already have a account</v-col>
              <v-col class="d-flex justify-end">
                <v-chip small link class="darkness primary--text pt-1 pb-1 ma-2 mr-10">Sign In</v-chip>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row >
    <v-col cols="8" justify="center" align="center" class="body-1 pt-1">
      <a class="leve--text" link>
        <u>Go to back</u>
      </a>
    </v-col>
    </v-row>-->
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      title: 'Select Wallet Creation Type',
      theme: 'dark',
      items: [
        {
          title: 'New',
          nameButton: 'Create',
          icon: 'icon-add.svg',
          route: '/create-new-signup'
        },
        {
          title: 'From a Private Key',
          nameButton: 'Create',
          icon: 'icon-private-key.svg',
          route: '/create-from-private-key'
        }
      ]
    }
  }
}
</script>
