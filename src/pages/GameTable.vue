<template>
  <div class="game-table relative h-screen bg-cover bg-center">
    <TileDeck
      @tile-click="drawTile"
      :tiles="tileDeck"
      class="tile-deck absolute left-10 top-1/2 transform -translate-y-1/2 z-10"
    />
    <BoardComponent
      :board="board"
      :widthGridSize="widthGridSize"
      :heightGridSize="heightGridSize"
      :center="center"
      @tile-selected="playTileToBoard"
    />
    <PlayerHand
      v-if="teamMateHand"
      :owner="teamMateHand"
      class="team-mate-hand absolute top-10 w-full"
      @tile-click="attemptPlaceTile"
    />
    <PlayerHand
      v-if="playerHand"
      :owner="playerHand"
      class="player-hand absolute bottom-10 w-full"
      @tile-click="attemptPlaceTile"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/store/gameStore'
import PlayerHand from '@/components/PlayerHand.vue'
import BoardComponent from '@/components/BoardComponent.vue'
import TileDeck from '@/components/TileDeck.vue'

export default defineComponent({
  name: 'GameTable',
  components: {
    PlayerHand,
    BoardComponent,
    TileDeck,
  },
  setup() {
    const route = useRoute()
    const gameStore = useGameStore()
    const decisionModeOn = ref(false)
    const playerTileSelected = ref(null)

    provide('decisionModeOn', decisionModeOn)
    provide('playerTileSelected', playerTileSelected)

    const playerHand = computed(() => gameStore.playerHand)
    const teamMateHand = computed(() => gameStore.teamMateHand)
    const board = computed(() => gameStore.board)
    const widthGridSize = computed(() => gameStore.widthGridSize)
    const heightGridSize = computed(() => gameStore.heightGridSize)
    const center = computed(() => gameStore.center)
    const tileDeck = computed(() => gameStore.tileDeck)

    const fetchGame = async () => {
      await gameStore.get(Number(route.params.gameId))
    }

    const playTileToBoard = (boardTile) => {
      if (isValidMove(playerTileSelected.value)) {
        placeTile(playerTileSelected.value, boardTile)
        decisionModeOn.value = false
        playerTileSelected.value = null
      }
    }

    const attemptPlaceTile = (tile) => {
      if (tileCanBePlacedAtBothEnds(tile)) {
        decisionModeOn.value = true
        playerTileSelected.value = tile
        return
      }
      console.log(isValidMove(tile))

      if (isValidMove(tile)) {
        decisionModeOn.value = false
        playerTileSelected.value = null
        return placeTile(tile)
      }
    }

    const placeTile = async (tile, boardTile) => {
      try {
        await gameStore.playTile(Number(route.params.gameId), tile, boardTile)
      } catch (error) {
        console.error('Failed to play tile:', error)
      }
    }

    const drawTile = async (tile) => {
      try {
        await gameStore.drawTile(Number(route.params.gameId), tile)
      } catch (error) {
        console.error('Failed to draw tile:', error)
      }
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
        const gridX = 100 / 6
        const gridY = 50 / 3

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

    const getCoreTile = (board) => {
      return board.value.find((tile) => {
        if (tile.core == true) {
          return tile
        }
      })
    }

    const isValidMove = (tile) => {
      if (board.value.length === 0) return true
      const core = getCoreTile(board)

      if (core.type == 'double') {
        return (
          board.value[0].top == tile.top ||
          board.value[0].top == tile.bottom ||
          board.value[board.value.length - 1].top == tile.bottom ||
          board.value[board.value.length - 1].top == tile.top
        )
      } else {
        return (
          board.value[0].top == tile.top ||
          board.value[0].top == tile.bottom ||
          board.value[board.value.length - 1].bottom == tile.bottom ||
          board.value[board.value.length - 1].bottom == tile.top
        )
      }
    }

    const tileCanBePlacedAtBothEnds = (tile) => {
      if (board.value.length === 0 || board.value.length === 1) return false

      const core = getCoreTile(board)
      if (core.type == 'double') {
        return (
          (board.value[0].top == tile.top || board.value[0].top == tile.bottom) &&
          (board.value[board.value.length - 1].top == tile.bottom ||
            board.value[board.value.length - 1].top == tile.top)
        )
      } else {
        return (
          (board.value[0].top == tile.top || board.value[0].top == tile.bottom) &&
          (board.value[board.value.length - 1].bottom == tile.bottom ||
            board.value[board.value.length - 1].bottom == tile.top)
        )
      }
    }

    onMounted(async () => {
      await fetchGame()
    })

    return {
      decisionModeOn,
      playerTileSelected,
      playerHand,
      teamMateHand,
      board,
      widthGridSize,
      heightGridSize,
      center,
      tileDeck,
      playTileToBoard,
      attemptPlaceTile,
      placeTile,
      drawTile,
      isValidMove,
      tileCanBePlacedAtBothEnds,
      createTileCanvas,
    }
  },
})
</script>

<style scoped>
.game-table {
  background-image: url('@/assets/game-table-background.png');
  background-size: cover;
  background-position: center;
  height: 100vh;
  position: relative;
}
.player-hand {
  @apply absolute bottom-10 w-full;
}
.team-mate-hand {
  @apply absolute top-10 w-full;
}
.tile-deck {
  @apply absolute left-10 top-1/2 transform -translate-y-1/2 z-10;
}
.center-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rotate-90 {
  transform: rotate(90deg);
}
</style>
