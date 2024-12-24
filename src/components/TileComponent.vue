<template>
  <div
    :class="['tile']"
    :style="{
      width: gridSize + 'px',
      height: gridSize * 2 + 'px',
      transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}) scaleY(${scaleY})`,
      margin: '-5px',
    }"
  >
    <img :src="tile.public_image_url" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'TileComponent',
  props: {
    tile: {
      type: Object,
      required: true,
    },
    gridSize: {
      type: Number,
      required: true,
    },
    center: {
      type: Object,
      required: true,
    },
    position: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    centerIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const limit = 4

    const rotation = computed(() => {
      const isDouble = props.tile.top === props.tile.bottom
      const isCore = props.tile.core

      if (isDouble && isCore) {
        return '0deg'
      }

      if (props.index > props.centerIndex) {
        if (props.index > props.centerIndex + limit) {
          return isDouble ? '90deg' : props.tile.flipped ? '0deg' : '180deg'
        }
        return isDouble ? '0deg' : props.tile.flipped ? '-90deg' : '90deg'
      }

      if (props.index < props.centerIndex) {
        if (props.index < props.centerIndex - limit) {
          return isDouble ? '90deg' : props.tile.flipped ? '180deg' : '0deg'
        }
        return isDouble ? '0deg' : props.tile.flipped ? '90deg' : '-90deg'
      }

      return isDouble ? '0deg' : '-90deg'
    })

    const scaleY = computed(() => {
      return props.tile.flipped ? -1 : 1
    })

    return {
      rotation,
      scaleY,
    }
  },
})
</script>

<style scoped>
.tile {
  @apply absolute flex justify-center items-center;
}


</style>
