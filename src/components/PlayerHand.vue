<template>
  <div class="flex flex-col items-center">
    <div id="121512" class="player-hand flex justify-center items-center">
      <div>
        <img
          id="avatar"
          :src="`https://api.dicebear.com/9.x/thumbs/png?radius=50&size=50&seed=${ownerUserId}`"
          :class="['mx-5', { 'blinking-border': isOwnerPlayerAtTurn }]"
        />
      </div>

      <draggable
        class="flex flex-row flex-wrap justify-center"
        :list="owner.tiles"
        group="tilesGroup"
        itemKey="id"
      >
        <template #item="{ element, index }">
          <img
            :src="createTileCanvas(element)"
            class="tile"
            :class="{
              'w-50 ': owner.tiles.length > 7 && index >= Math.ceil(owner.tiles.length / 2),
              'tile-small': !isOwner,
              'mr-[-20px] ml-[-20px]': isOwner,
            }"
            @click="isCurrentPlayerAtTurn && onTileClick(element)"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import draggable from 'vuedraggable'
import { useGameStore } from '@/store/gameStore'
import { useUserStore } from '@/store/userStore'

export default defineComponent({
  name: 'PlayerHand',
  props: {
    owner: {
      type: Object,
      required: true,
    },
  },
  components: {
    draggable,
  },
  emits: ['tile-click'],
  setup(props, { emit }) {
    const gameStore = useGameStore()
    const userStore = useUserStore()

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

    const isOwner = computed(() => props.owner.user_id === userStore.currentUser.id)

    const ownerUserId = computed(() => props.owner.user_id)

    const isCurrentPlayerAtTurn = computed(
      () =>
        gameStore.currentPlayerAtTurn &&
        gameStore.currentPlayerAtTurn.id === userStore.currentUser.id,
    )

    const isOwnerPlayerAtTurn = computed(
      () =>
        gameStore.currentPlayerAtTurn && gameStore.currentPlayerAtTurn.id === props.owner.user_id,
    )

    return {
      onTileClick,
      createTileCanvas,
      isOwnerPlayerAtTurn,
      isCurrentPlayerAtTurn,
      ownerUserId,
      isOwner,
      owner: props.owner,
    }
  },
})
</script>

<style scoped>
.tile {
  @apply rotate-90 my-5;
}

.tile-small {
  width: 50px;
  margin-left: -20px;
}
.player-hand {
  @apply justify-center;
}

img {
  object-fit: cover;
  object-position: -20% 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.blinking-border {
  border: 5px solid red;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    border-color: red;
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: red;
  }
}
</style>
