<template>
  <div class="board">
    <TileComponent
      v-for="(tile, index) in board"
      :key="tile.id"
      :tile="tile"
      :heightGridSize="heightGridSize"
      :widthGridSize="widthGridSize"
      :center="center"
      :index="index"
      :coreTile="board.find((tile) => tile.core)"
      :centerIndex="board.findIndex((tile) => tile.core)"
      :highlight="decisionModeOn && (index === 0 || index === board.length - 1)"
      :position="index"
      @click="selectTile(tile)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import TileComponent from '@/components/TileComponent.vue'

export default defineComponent({
  name: 'BoardComponent',
  components: {
    TileComponent,
  },
  props: {
    board: {
      type: Array,
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
  },
  setup() {
    const decisionModeOn = inject('decisionModeOn')
    return {
      decisionModeOn,
    }
  },
  methods: {
    selectTile(tile) {
      if (this.decisionModeOn) {
        console.log(tile)
        this.$emit('tile-selected', tile)
      }
    },
    createTileCanvas(tile) {
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
    },
  },
})
</script>

<style scoped>
.board {
  @apply flex justify-center items-center w-full h-full relative border border-gray-300;
}
</style>
