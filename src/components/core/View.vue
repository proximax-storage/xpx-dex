<template>
  <v-content >
    <v-fade-transition  mode="out-in"  transition="slide-x-transition">
      <router-view />
    </v-fade-transition>
    <!-- <core-footer v-if="$route.name !== 'Maps'" /> -->
  </v-content>
</template>
<script>
export default {
}
</script>
