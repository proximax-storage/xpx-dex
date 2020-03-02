<template>
  <!-- <v-tabs>
    <v-tab>Item One</v-tab>
    <v-tab>Item Two</v-tab>
    <v-tab>Item Three</v-tab>
  </v-tabs> -->
  <!-- <v-container class="fill-height"> -->
  <!-- <v-row justify="center" align="center">
      <v-col cols="12">
        <v-tabs grow  >
          <v-tab color="red">
            <v-col cols="6">
              <v-row class="mx-auto">
                <v-col justify="center" align="center">
                  <span class="font-italic font-weight-bold headline">Buy</span>
                </v-col>
              </v-row>
            </v-col>
          </v-tab>
          <v-tab>
            <v-col cols="6">
              <v-row class="mx-auto">
                <v-col justify="center" align="center">
                  <span class="font-italic font-weight-bold headline">Sell</span></v-col
                >
              </v-row>
            </v-col>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row> -->
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" class="mb-0  pb-0">
        <v-item-group mandatory v-model="active">
          <v-row>
            <v-col cols="6" class="mr-0 pr-0">
              <v-item v-slot:default="{ active, toggle }" value="buy">
                <v-row class="mx-auto mr-0 pr-0">
                  <v-col class="mr-0 pr-0" justify="center" align="center">
                    <v-btn color="dim" min-width="200" @click="toggle()" text large>
                      <span class="font-italic font-weight-bold headline text-capitalize">
                        Buy
                      </span></v-btn
                    >
                    <v-scroll-y-transition>
                      <v-sheet height="4" tile :color="active ? 'dim' : 'grey lighten-2'">
                      </v-sheet>
                      <!-- <v-divider :color="active ? 'primary' : ''" class="pt-1" /> -->
                    </v-scroll-y-transition>
                  </v-col>
                </v-row>
              </v-item>
            </v-col>
            <v-col cols="6" class="ml-0 pl-0">
              <v-item v-slot:default="{ active, toggle }" value="sell">
                <v-row class="mx-auto">
                  <v-col class="ml-0 pl-0" justify="center" align="center">
                    <v-btn color="pin" min-width="200" @click="toggle()" text large>
                      <span class="font-italic font-weight-bold headline text-capitalize">
                        Sell
                      </span></v-btn
                    >
                    <v-scroll-y-transition>
                      <!-- <div :background-color="active ? 'primary' : 'pin'" > -->
                      <!-- <v-divider :color="active ? 'primary' : ''" class="pt-1" /> -->
                      <v-sheet height="4" tile :color="active ? 'pin' : 'grey lighten-2'">
                      </v-sheet>
                      <!-- </div> -->
                    </v-scroll-y-transition>
                  </v-col>
                </v-row>
                <!-- <v-divider   :color="active ? 'primary' : 'grey lighten-4'" class="pt-1" /> -->
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-col>
      <v-col cols="10" class="pt-0 mt-0">
        <v-row class="mx-auto">
          <v-col class="pt-0 mt-0" cols="4"
            ><v-text-field
              v-model.trim="asset"
              :label="configForm.asset.label"
              :minlength="configForm.asset.min"
              :maxlength="configForm.asset.max"
              :counter="configForm.asset.max"
              :color="inputStyle"
              :rules="[
                configForm.asset.rules.required,
                configForm.asset.rules.min,
                configForm.asset.rules.max
              ]"
            ></v-text-field>
          </v-col>
          <v-col cols="4">hola 2 </v-col>
          <v-col cols="4">hola 3 </v-col></v-row
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import generalMixins from '../../mixins/general-mixin'
export default {
  mixins: [generalMixins],
  data: () => ({
    active: null,
    configForm: null,
    asset: null,
    inputStyle: 'inputStyle',
    msgServer: null
  }),
  sockets: {
    connect: function () {
      console.log('socket connected')
      this.sockets.subscribe('chat_message', data => {
        console.log('data', data)
        this.msg = data.message
      })
    },
    disconnect: function () {
      console.log('server disconnected')
      this.sockets.unsubscribe('chat_message')
    },
    customEmit: function (data) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("customEmit", data)'
      )
    }
  },
  methods: {
    send () {
      console.log('active', this.active)
    }
  },
  // mounted () {
  //   // this.$sse('/your-events-endpoint', { withCredentials: true })
  //   this.$sse('http://localhost:3500/offertTx', { format: 'json' }) // or { format: 'plain' }
  //     .then(sse => {
  //       // Store SSE object at a higher scope
  //       this.msgServer = sse
  //       // Catch any errors (ie. lost connections, etc.)
  //       sse.onError(e => {
  //         console.error('lost connection; giving up!', e)
  //         // This is purely for example; EventSource will automatically
  //         // attempt to reconnect indefinitely, with no action needed
  //         // on your part to resubscribe to events once (if) reconnected
  //         sse.close()
  //       })
  //       // Listen for messages based on their event (in this case, "chat")
  //       sse.subscribe('message', (message, rawEvent) => {
  //         console.log('message', message)
  //       })

  //       // Unsubscribes from event-less messages after 7 seconds
  //       // setTimeout(() => {
  //       //   sse.unsubscribe('message')

  //       //   console.log('Stopped listening to event-less messages!')
  //       // }, 7000)

  //       // Unsubscribes from chat messages after 7 seconds
  //       // setTimeout(() => {
  //       //   sse.unsubscribe('chat')

  //       //   console.log('Stopped listening to chat messages!')
  //       // }, 14000)
  //     })
  //     .catch(err => {
  //       // When this error is caught, it means the initial connection to the
  //       // events server failed.  No automatic attempts to reconnect will be made.
  //       console.error('Failed to connect to server', err)
  //     })
  // },
  beforeDestroy () {
    // Make sure to close the connection with the events server
    // when the component is destroyed, or we'll have ghost connections!
    this.msgServer.close()
  },
  beforeMount () {
    this.configForm = this.getConfigForm()
  }
}
</script>
