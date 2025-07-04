<template>
  <div class="tile-component" :style="tileStyle" @click="onTileClick">
    <img :src="createTileCanvas(tile)" :class="{ highlight: highlight }" />
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
    heightGridSize: {
      type: Number,
      required: true,
    },
    widthGridSize: {
      type: Number,
      required: true,
    },
    center: {
      type: Object,
      required: true,
    },
    centerIndex: {
      type: Number,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    coreTile: {
      type: Object,
      required: true,
    },
    highlight: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const decisionModeOn = inject('decisionModeOn')

    const rotation = computed(() => {
      const limit = 4
      const otherLimit = 3
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
            return isDouble ? '0deg' : props.tile.flipped ? '180deg' : '-90deg'
          }
          if (props.index > props.centerIndex + limit) {
            return isDouble ? '90deg' : props.tile.flipped ? '180deg' : '180deg'
          }

          return isDouble ? '0deg' : props.tile.flipped ? '-90deg' : '-90deg'
        }

        if (props.index < props.centerIndex) {
          if (props.index == props.centerIndex - limit) {
            return isDouble ? '0deg' : props.tile.flipped ? '180deg' : '90deg'
          }
          if (props.index < props.centerIndex - limit) {
            if (props.index < props.centerIndex - limit - otherLimit) {
              return isDouble ? '90deg' : props.tile.flipped ? '-90deg' : '-90deg'
            }
            return isDouble ? '90deg' : props.tile.flipped ? '0deg' : '0deg'
          }

          return isDouble ? '0deg' : props.tile.flipped ? '90deg' : '90deg'
        }

        return isDouble ? '0deg' : '90deg'
      }
    })

    const onTileClick = () => {
      emit('click', props.tile)
    }

    const createTileCanvas = (tile) => {
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 50
      const ctx = canvas.getContext('2d')

      const drawDots = (x, y, num) => {
        const dotRadius = 5
        const dotPositions = [
          [],
          [[1, 1]],
          [
            [0, 0],
            [2, 2],
          ],
          [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
          [
            [0, 0],
            [0, 2],
            [2, 0],
            [2, 2],
          ],
          [
            [0, 0],
            [0, 2],
            [1, 1],
            [2, 0],
            [2, 2],
          ],
          [
            [0, 0],
            [0, 2],
            [1, 0],
            [1, 2],
            [2, 0],
            [2, 2],
          ],
        ]
        const gridX = 100 / 8
        const gridY = 50 / 4

        dotPositions[num].forEach(([dx, dy]) => {
          ctx.beginPath()
          ctx.arc(x + gridX * (dx + 1), y + gridY * (dy + 1), dotRadius, 0, Math.PI * 2)
          ctx.fillStyle = 'black'
          ctx.fill()
        })
      }

      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 100, 50)
      ctx.strokeStyle = 'black'
      ctx.strokeRect(0, 0, 100, 50)
      ctx.beginPath()
      ctx.moveTo(50, 0)
      ctx.lineTo(50, 50)
      ctx.stroke()

      drawDots(0, 0, tile.top)
      drawDots(50, 0, tile.bottom)

      return canvas.toDataURL()
    }

    const tileStyle = computed(() => {
      return {
        transform: `translate(${props.tile.position.x}px, ${props.tile.position.y}px) rotate(${rotation.value})`,
      }
    })

    return {
      decisionModeOn,
      onTileClick,
      createTileCanvas,
      tileStyle,
    }
  },
})
</script>

<style scoped>
.tile-component {
  cursor: pointer;
  position: absolute;
}
.highlight {
  @apply border-4 border-blue-500 rounded-lg shadow-lg;
}
</style>
