<template>
  <div class="tile-deck flex flex-col items-center">
    <div class="deck my-5 flex flex-col justify-center items-center">
      <img
        v-for="tile in tiles"
        :key="tile.id"
        :src="tile.public_image_url"
        class="tile m-1"
        @click="onTileClick(tile)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TileDeck',
  props: {
    tiles: {
      type: Array,
      required: true,
    },
  },
  emits: ['tile-click'],
  setup(props, { emit }) {
    const onTileClick = (tile) => {
      emit('tile-click', tile)
    }

    return {
      onTileClick,
    }
  },
})
</script>

<style scoped>
.tile {
  @apply m-1;
  width: 50px;
}
</style>
