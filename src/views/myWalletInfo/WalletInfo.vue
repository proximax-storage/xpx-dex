<template>
  <v-col class="pa-3">
    <v-row>
      <v-col cols="12" class="headline font-weight-regular text-left primary--text">Account details</v-col>
    </v-row>
    <!-- mosaicInfo -->
    <v-row class="pt-4">
      <v-col sm="7" md="7" lg="9" col="9" class="pt-0">
        <v-tabs v-model="tab" background-color="transparent" color="primary" grow slider-size="4">
          <div
            class="v-tabs-slider-wrapper"
            style="height: 4px; width: 100%; color: #efe4d9; z-index:0"
          >
            <div class="v-tabs-slider"></div>
          </div>
          <v-tab
            class="title text-capitalize font-weight-bold"
            v-for="item in arrayItems"
            :key="item.item"
            :value="item.name"
          >{{ item.name }}</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <!-- <v-sheet style="bottom" height="4" tile color="pin"></v-sheet> -->
          <v-tab-item v-for="item in arrayItems" :key="item.item" :value="item">{{ tab }}</v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
export default {
  data () {
    return {
      tab: 3,
      arrayItems: [
        {
          items: 'assets',
          name: 'Assets',
          index: 0
        },
        {
          items: 'activity',
          name: 'Activity',
          index: 1
        },
        {
          items: 'myOffers',
          name: 'My offers',
          index: 2
        },
        {
          items: 'info',
          name: 'Info',
          index: 3
        }
      ]
    }
  }
}
</script>
