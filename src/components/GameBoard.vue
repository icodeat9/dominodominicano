<template>
  <div class="game-board flex flex-col justify-between items-center h-screen w-screen bg-gray-800">
    <div
      class="board flex flex-wrap w-full h-full bg-gray-200 border-4 border-gray-700 rounded-lg p-2"
    ></div>
    <div class="player-hand-container flex justify-center w-full p-4">
      <PlayerHand :tiles="[]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerHand from './PlayerHand.vue'
</script>

<style scoped>
.half-6 {
  @apply bg-red-500;
}

.half-5 {
  @apply bg-yellow-500;
}

/* Add styles for other domino values */
</style>
