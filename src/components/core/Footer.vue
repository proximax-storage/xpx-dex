<template>
  <v-footer :inset="footer.inset" app color="leveint"  dense class="font-weight-light caption">
    <v-col class="text-center ma-0 pa-0" cols="12"
      ><span class="px-4">Copyright&copy; {{new Date().getFullYear()}} ProximaX&reg;. All Rights Reserved.</span>
    </v-col>
  </v-footer>
</template>
<script>
export default {
  data: () => ({
    footer: {
      inset: true
    }
  })
}
</script>
