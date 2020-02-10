<template>
  <v-row class="d-flex justify-center">
    <template v-for="(item, key) of arrayBtn">
      <v-btn
        :loading="item.loading"
        :disabled="item.disabled"
        :key="key"
        :color="item.color"
        class="pl-8 pr-8 mt-2 mr-3  body-2 white--text"
        rounded
        @click="triggerClick(item.action)"
      >{{item.text}}</v-btn>
    </template>
  </v-row>
</template>

<script>
export default {
  props: ['arrayBtn'],
  methods: {
    triggerClick (action) {
      this.$emit('action', action)
    }
  }
}
</script>
