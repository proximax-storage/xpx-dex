/* eslint-disable no-undef */
<template>
  <v-col cols="12">
    <v-form ref="form" v-model="valid">
      <v-row>
        <v-col sm="12" md="9" lg="9" col="9">
          <v-file-input
            id="getFile"
            v-model="getFile"
            show-size
            counter
            :rules="[
      configForm.iconMosaic.rules.size,
      configForm.iconMosaic.rules.typeForm,
      isValidImg]"
            :accept="'image/png'"
            dense
            :color="inputStyle"
            placeholder="Select your files"
            :label="configForm.iconMosaic.label"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip :color="inputStyle" dark label small>{{ text }}</v-chip>
            </template>
          </v-file-input>
        </v-col>
        <v-col
          sm="12"
          md="3"
          lg="3"
          col="3"
          class="d-flex mx-auto justify-space-around align-center"
        >
          <img v-if="base64File" :src="base64File" />
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>
<script>
import { validateDimensionImg, arrayToBase64Img } from '@/services/icon-mosaic-service'
export default {
  data () {
    return {
      valid: true,
      inputStyle: 'inputStyle',
      configForm: null,
      form: {
        file: null
      },
      isValidImg: true,
      base64File: null,
      rules: []
    }
  },
  beforeMount () {
    this.$emit('validIconMosaic', false)

    this.configForm = {
      iconMosaic: this.$configForm.iconMosaic()
    }
  },
  computed: {
    getFile: {
      get () {
        this.readImage(this.form.file)
        return this.form.file
      },
      set (newValue) {
        this.form.file = newValue
      }
    }
  },
  methods: {
    reset () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
    },
    readImage (file) {
      if (file) {
        this.valid = true
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener('load', () => {
          this.base64File = reader.result
          validateDimensionImg(reader.result).then(data => {
            this.isValidImg = !data.status ? data.msj : data.status
            if (data.status && this.valid) {
              this.$emit('arrayToBase64Img', arrayToBase64Img(reader.result))
              this.$emit('validIconMosaic', true)
            } else {
              this.$emit('arrayToBase64Img', null)
              this.$emit('validIconMosaic', false)
            }
          })
        })
      } else {
        this.$emit('arrayToBase64Img', null)
        this.reset()
        this.$emit('validIconMosaic', true)
        this.base64File = null
      }
    }
  }
}
</script>
