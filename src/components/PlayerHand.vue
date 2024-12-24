<template>
  <div class="flex flex-col items-center">
    <div id="121512" class="player-hand my-5 flex justify-center items-center">
      <div class="flex flex-row flex-wrap justify-center">
        <img
          v-for="(tile, index) in tiles"
          :key="tile.id"
          :src="tile.public_image_url"
          class="tile m-0"
          :class="{
            'w-50 ': tiles.length > 7 && index >= Math.ceil(tiles.length / 2),
            'tile-small': !isOwner
          }"
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
    isOwner: {
      type: Boolean,
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
  @apply rotate-90 my-5 mx-0;
}
.tile-small {
  width: 50px;
}
.player-hand {
  @apply justify-center;
}
</style>
