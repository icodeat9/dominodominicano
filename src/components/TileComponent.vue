<template>
  <div :class="['tile']" :style="positionStyle">
    <img :src="tile.public_image_url" :class="{ highlight: highlight }" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, inject } from 'vue'

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
    highlight: {
      type: Boolean,
      required: true,
    },
    coreTile: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const limit = 5
    const decisionModeOn = inject('decisionModeOn')

    const rotation = computed(() => {
      if (props.coreTile.type == 'single') {
        const isDouble = props.tile.top === props.tile.bottom
        const isCore = props.tile.core

        if (props.index > props.centerIndex) {
          if (props.index == props.centerIndex + limit) {
            return isDouble ? '0deg' : props.tile.flipped ? '-90deg' : '0deg'
          }
          if (props.index > props.centerIndex + limit) {
            return isDouble ? '90deg' : props.tile.flipped ? '180deg' : '0deg'
          }
          return isDouble ? '0deg' : props.tile.flipped ? '-90deg' : '90deg'
        }

        if (props.index < props.centerIndex) {
          if (props.index == props.centerIndex - limit) {
            return isDouble ? '0deg' : props.tile.flipped ? '180deg' : '180deg'
          }
          if (props.index < props.centerIndex - limit) {
            return isDouble ? '90deg' : props.tile.flipped ? '180deg' : '0deg'
          }

          return isDouble ? '0deg' : props.tile.flipped ? '-90deg' : '90deg'
        }

        return isDouble ? '0deg' : '90deg'
      } else {
        const isDouble = props.tile.top === props.tile.bottom
        const isCore = props.tile.core

        if (props.index > props.centerIndex) {
          if (props.index == props.centerIndex + limit) {
            return isDouble ? '0deg' : props.tile.flipped ? '0deg' : '180deg'
          }
          if (props.index > props.centerIndex + limit) {
            return isDouble ? '90deg' : props.tile.flipped ? '0deg' : '180deg'
          }
          return isDouble ? '0deg' : props.tile.flipped ? '90deg' : '-90deg'
        }

        if (props.index < props.centerIndex) {
          if (props.index == props.centerIndex - limit) {
            return isDouble ? '0deg' : props.tile.flipped ? '0deg' : '0deg'
          }
          if (props.index < props.centerIndex - limit) {
            return isDouble ? '90deg' : props.tile.flipped ? '180deg' : '0deg'
          }

          return isDouble ? '0deg' : props.tile.flipped ? '-90deg' : '90deg'
        }

        return isDouble ? '0deg' : '90deg'
      }
    })

    const scaleY = computed(() => {
      return props.tile.flipped ? -1 : 1
    })

    const positionStyle = {
      width: props.gridSize + 'px',
      height: props.gridSize * 2 + 'px',
      transform: `translate(${props.position.x}px, ${props.position.y}px) rotate(${rotation.value}) scaleY(${scaleY.value})`,
      margin: '-5px',
    }

    return {
      rotation,
      scaleY,
      decisionModeOn,
      positionStyle,
    }
  },
})
</script>

<style scoped>
.tile {
  @apply absolute flex justify-center items-center;
}
.highlight {
  @apply border-4 border-blue-500 rounded-lg shadow-lg;
}
</style>
