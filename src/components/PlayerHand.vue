<template>
  <div class="flex flex-col items-center">
    <div id="121512" class="player-hand my-5 flex justify-center items-center">
      <div class="flex flex-row">
        <img
          v-for="tile in tiles"
          :key="tile.id"
          :src="tile.public_image_url"
          class="tile rotate-90 m-0"
          @click="onTileClick(tile)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PlayerHand',
  props: {
    tiles: {
      type: Array,
      required: true,
    },
  },
  emits: ['tile-click'],
  methods: {
    onTileClick(tile) {
      this.$emit('tile-click', tile)
    },
  },
})
</script>

<style scoped>
.tile {
  @apply rotate-90 m-0;
}
</style>
