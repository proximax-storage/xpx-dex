<template>
  <div>
    <v-dialog v-model="showDialog" max-width="760px" content-class="br-30px">
      <v-card>
        <!-- Header title -->
        <v-container class="pt-0 pb-0">
          <v-row>
            <v-col cols="10" class="pt-0">
              <v-card-title v-if="title" :class="classTitle">{{title}}</v-card-title>
            </v-col>
            <v-col cols="2" class="pt-0 d-flex justify-end align-center">
              <v-btn x-small text @click="showDialog = false">
                <v-icon color="gray" class="mr-2">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>

        <!-- Content -->
        <v-card-text>
          <v-container fluid>
            <slot name="dialog-body"></slot>
          </v-container>
        </v-card-text>

        <!-- Actions (Buttons) -->
        <template v-if="buttons">
          <v-card-actions class="d-flex justify-center align-center pb-8">
            <div>
              <custom-buttons @action="$emit('action', $event)" :buttons="buttons"></custom-buttons>
            </div>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Buttons from '@/core/components/shared/Buttons'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    classTitle: {
      type: String,
      default: null
    },
    buttons: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showPwd: false
    }
  },
  computed: {
    showDialog: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  components: {
    'custom-buttons': Buttons
  }
}
</script>
