<template>
  <div class="board">
    <TileComponent
      v-for="(tile, index) in board"
      :key="tile.id"
      :tile="tile"
      :gridSize="gridSize"
      :center="center"
      :position="getTilePosition(tile, index)"
      :index="index"
      :centerIndex="centerIndex"
      :coreTile="board.find((tile) => tile.core)"
      :highlight="decisionModeOn && (index === 0 || index === board.length - 1)"
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
    gridSize: {
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
  computed: {
    centerIndex() {
      return this.board.findIndex((t) => t.core)
    },
  },
  methods: {
    selectTile(tile) {
      if (this.decisionModeOn) {
        console.log(tile)
        this.$emit('tile-selected', tile)
      }
    },
    getTilePosition(tile, index) {
      if (tile.core) {
        return { x: this.center.x - this.gridSize / 2, y: this.center.y - this.gridSize }
      }
      const offset = this.gridSize + 1 // Adjust the offset as needed

      if (index > this.centerIndex) {
        const limit = 5

        if (index == this.centerIndex + limit) {
          // pivot tile
          const previousPosition = this.getTilePosition(this.board[index - 1], index - 1)

          if (tile.type == 'double') {
            return {
              x: previousPosition.x,
              y: previousPosition.y + offset,
            }
          }
          return {
            x: previousPosition.x + 10,
            y: previousPosition.y + offset,
          }
        }
        if (index > this.centerIndex + limit) {
          // pivot tile
          const pivotPosition = this.getTilePosition(
            this.board[this.centerIndex + limit],
            this.centerIndex + limit,
          )
          return {
            x: pivotPosition.x + offset * (index - this.centerIndex - limit),
            y: pivotPosition.y - offset / 45,
          }
        }
        const previousPosition = this.getTilePosition(this.board[index - 1], index - 1)

        return {
          x: previousPosition.x,
          y: previousPosition.y + offset,
        }
      } else if (index < this.centerIndex) {
        const limit = 5

        if (index == this.centerIndex - limit) {
          // pivot tile
          const previousPosition = this.getTilePosition(this.board[index + 1], index + 1)

          if (tile.type == 'double') {
            return {
              x: previousPosition.x,
              y: previousPosition.y - offset,
            }
          }
          return {
            x: previousPosition.x - 10,
            y: previousPosition.y - offset,
          }
        }

        if (index < this.centerIndex - limit) {
          // pivot tile
          const pivotPosition = this.getTilePosition(
            this.board[this.centerIndex - limit],
            this.centerIndex - limit,
          )
          return {
            x: pivotPosition.x - offset * (this.centerIndex - index - limit),
            y: pivotPosition.y + offset / 45,
          }
        }
        const previousPosition = this.getTilePosition(this.board[index + 1], index + 1)

        return {
          x: previousPosition.x,
          y: previousPosition.y - offset,
        }
      } else {
        return {
          x: previousPosition.x,
          y: previousPosition.y + offset,
        }
      }
    },
  },
})
</script>

<style scoped>
.board {
  @apply flex justify-center items-center w-full h-full relative border border-gray-300;
}
</style>
