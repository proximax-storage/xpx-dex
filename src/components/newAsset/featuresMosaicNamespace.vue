<template>
  <v-row>
    <v-col col="12" class="ma-2">
      <div>
        <span
          class="caption font-weight-light.font-italic"
          style="text-align: justify; line-height: 17px;"
        >
          <p>
            A namespace can have a maximium length of 16 alphanumerical characters while sub-namespaces can have a
            maximium length of 64 alphanumerical characters.
          </p>
          <p>
            Three layers can be created. A namespace can have a subnamespace, and a subnamespace can have its own
            subnamespace (e.g., test1.test2.test3).
          </p>
          <p>Certain phrases are already reserved.</p>
          <p class="font-weight-bold"></p>
        </span>
      </div>
      <div>
        <span class="caption font-weight-bold">Maximum rental duration is 1 year (365 days).</span>
      </div>
      <div class="mt-2">
        <span class="caption">
          Maximum divisibility is 6.
          <br />
        </span>
        <span class="caption font-weight-bold">Example: 0.000000</span>
      </div>
      <div class="mt-2">
        <span class="caption">
          Maximum supply is 90B.
          <br />
        </span>
        <span class="caption font-weight-bold">Example: {{supply  | toCurrency}}</span>
      </div>
      <div class="mt-2">
        <span class="caption">If you tick "Transferable", mosaic can be transferred.</span>
      </div>

      <div class="mt-2">
        <span class="caption">If you tick "Supply Mutable", supply can be changed.</span>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ['supply']
}
</script>
