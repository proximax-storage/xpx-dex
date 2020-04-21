<template>
  <v-snackbar
    v-model="snackbar.snackbar"
    :bottom="snackbar.y === 'bottom'"
    :top="snackbar.y === 'top'"
    :right="snackbar.x === 'right'"
    :left="snackbar.x === 'left'"
    :vertical="snackbar.mode === 'vertical'"
    :color="snackbar.color"
    :multi-line="snackbar.mode === 'multi-line'"
    :timeout="snackbar.timeout"
  >
    {{ snackbar.text }}
    <v-btn dark text @click="snackbar.snackbar = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['snackbar'])
  }
}
</script>
