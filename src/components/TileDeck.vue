<template>
  <div class="tile-deck flex flex-col items-center">
    <div class="deck my-5 flex flex-col justify-center items-center">
      <img
        v-for="tile in tiles"
        :key="tile.id"
        :src="createTileCanvas(tile)"
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

    return {
      onTileClick,
      createTileCanvas,
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
