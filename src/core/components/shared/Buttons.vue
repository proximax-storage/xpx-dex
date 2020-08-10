<template>
  <v-row :class="myClass">
    <template v-for="(item, key) of buttons">
      <v-btn
        :loading="item.loading"
        :disabled="item.disabled"
        :key="key"
        :color="item.color"
        class="text-transform-none pl-8 pr-8 mt-2 mr-3 subtitle-1 font-regular"
        rounded
        @click="triggerClick(item.action)"
      >{{item.text}}</v-btn>
    </template>
  </v-row>
</template>

<script>
export default {
  props: {
    buttons: {
      type: [Object, Array],
      default: null
    },
    myClass: {
      type: String,
      default: 'd-flex justify-center'
    }
  },
  methods: {
    triggerClick (action) {
      this.$emit('action', action)
    }
  }
}
</script>
