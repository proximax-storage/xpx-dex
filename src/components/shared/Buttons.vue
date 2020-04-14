<template>
  <v-row :class="`d-flex justify-${align}`">
    <template v-for="(item, key) of arrayBtn">
      <template v-if="type === 'text'">
        <v-btn
          text
          large
          :loading="item.loading"
          :disabled="item.disabled"
          :key="key"
          :color="item.color"
          class="pl-8 pr-8 mt-2 body-2 mx-auto"
          @click="triggerClick(item.action)"
        >{{ item.text }}</v-btn>
      </template>
      <template v-else>
        <v-btn
          :loading="item.loading"
          :disabled="item.disabled"
          :key="key"
          :color="item.color"
          class="pl-8 pr-8 mt-2 body-2 mx-auto"
          :class="item.textColor"
          rounded
          @click="triggerClick(item.action)"
        >{{ item.text }}</v-btn>
      </template>
    </template>
  </v-row>
</template>

<script>
export default {
  props: ['arrayBtn', 'align', 'type'],
  methods: {
    triggerClick (action) {
      this.$emit('action', action)
    }
  }
}
</script>
