<template>
  <v-row :class="`d-flex justify-${align}`">
    <template v-for="(item, key) of arrayBtn">
      <v-btn
        :loading="item.loading"
        :disabled="item.disabled"
        :key="key"
        :color="item.color"
        class="pl-8 pr-8 mt-2   body-2"
        :class="item.textColor"
        rounded
        @click="triggerClick(item.action)"
        >{{ item.text }}</v-btn
      >
    </template>
  </v-row>
</template>

<script>
export default {
  props: ['arrayBtn', 'align'],
  methods: {
    triggerClick (action) {
      this.$emit('action', action)
    }
  }
}
</script>
