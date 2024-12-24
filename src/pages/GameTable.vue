<template>
  <div class="game-table relative h-screen bg-cover bg-center">
    <TileDeck @tile-click="drawTile" :tiles="tileDeck" class="tile-deck absolute left-10 top-1/2 transform -translate-y-1/2 z-10" />
    <BoardComponent :board="board" :gridSize="gridSize" :center="center" />
    <PlayerHand
      v-if="teamMateHand"
      :tiles="teamMateHand.tiles"
      :isOwner="false"
      class="team-mate-hand absolute top-10 w-full"
      @tile-click="attemptPlaceTile"
    />
    <PlayerHand
      v-if="playerHand"
      :tiles="playerHand.tiles"
      :isOwner="true"
      class="player-hand absolute bottom-10 w-full"
      @tile-click="attemptPlaceTile"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
  data() {
    return {
      openEnds: [],
    }
  },
  computed: {
    playerHand() {
      return useGameStore().playerHand
    },
    teamMateHand() {
      return useGameStore().teamMateHand
    },
    board() {
      return useGameStore().board
    },
    gridSize() {
      return useGameStore().gridSize
    },
    center() {
      return useGameStore().center
    },
    tileDeck() {
      return useGameStore().tileDeck
    },
  },
  methods: {
    async fetchGame() {
      await useGameStore().get(Number(this.$route.params.gameId))
    },
    attemptPlaceTile(tile) {
      if (this.isValidMove(tile)) {
        this.placeTile(tile)
      }
    },
    async placeTile(tile) {
      const gameStore = useGameStore()
      try {
        await gameStore.playTile(Number(this.$route.params.gameId), tile)
      } catch (error) {
        console.error('Failed to play tile:', error)
      }
    },
    async drawTile(tile) {
      const gameStore = useGameStore()
      try {
        await gameStore.drawTile(Number(this.$route.params.gameId), tile)
      } catch (error) {
        console.error('Failed to draw tile:', error)
      }
    },
    isValidMove(tile) {
      return (
        this.openEnds.length === 0 ||
        this.openEnds.some((end) => tile.top === end || tile.bottom === end)
      )
    },
    updateOpenEnds(tile) {
      this.openEnds = this.openEnds.filter((end) => end !== tile.top && end !== tile.bottom)
      this.openEnds.push(tile.top, tile.bottom)
    },
  },
  async mounted() {
    await this.fetchGame()
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
