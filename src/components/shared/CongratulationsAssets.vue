<template>
  <v-row>
    <v-col cols="12">
      <div
        class="display-1 font-weight-regular text-left primary--text"
        v-bind:class="[colorText]"
      >Congratulations</div>
      <div class="ma-2 ml-4 mx-auto">
        <div
          class="caption font-weight-black pt-3"
        >You trasaction has beet successfully registered into blockchain.</div>
      </div>
      <template>
        <div class="ma-2 pt-4 ml-4 mx-auto" v-for="i in txInfo" v-bind:key="i.hash">
          <span class="body-1 font-weight-black">Hash :</span>
          <span class>{{ i.hash }}</span>
        </div>
      </template>
      <div class="ma-2 pt-4 ml-4 mx-auto">
        <p class="caption">
          Disclosure: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis varius
          mauris, non aliquet libero. Pellentesque est eros. pharetra non finibus et, fermentum sed
          felis. Duis portito. purus a suscipit consequat
        </p>
      </div>
    </v-col>
    <v-col cols="6" class="caption d-flex">
      <custom-buttons @action="action" :align="'start'" :arrayBtn="getArrayBtn[0]"></custom-buttons>
    </v-col>
    <!-- <v-col class="ml-4" cols="12"> HAS </v-col> -->
  </v-row>
</template>
<script>
export default {
  props: ['txInfo', 'colorText'],
  data: () => {
    return {
      arrayBtn: null
    }
  },
  computed: {
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      return arrayBtn
    }
  },
  components: {
    'custom-buttons': () => import('@/components/shared/Buttons')
  },
  methods: {
    action (action) {
      switch (action) {
        case 'viewOnExplorer':
          this.$router.push({ path: '/searchOfferts' })
          break
        case 'print':
          break
      }
    }
  },
  beforeMount () {
    this.arrayBtn = [
      {
        print: {
          key: 'print',
          action: 'print',
          disabled: false,
          color: 'white',
          textColor: 'primary--text',
          loading: false,
          text: 'Print'
        },
        viewOnExplorer: {
          key: 'viewOnExplorer',
          action: 'viewOnExplorer',
          disabled: false,
          color: 'primary',
          textColor: 'white--text',
          loading: false,
          text: 'view on explorer'
        }
      }
    ]
  }
}
</script>
