<template>
  <div class="tile flex flex-col w-24 h-48 border-2 border-black rounded-lg bg-white">
    <div class="half-tile flex flex-wrap justify-center items-center w-full h-1/2">
      <div class="flex flex-wrap justify-center items-center w-full">
        <div
          v-for="dot in topDots"
          :key="dot"
          class="dot w-5 h-5 bg-black rounded-full m-1"
          style="flex: 0 0 33%; aspect-ratio: 1"
        ></div>
      </div>
    </div>
    <div class="divider w-full h-0.5 bg-black"></div>
    <div class="half-tile flex flex-wrap justify-center items-center w-full h-1/2">
      <div class="flex flex-wrap justify-center items-center w-full">
        <div
          v-for="dot in bottomDots"
          :key="dot"
          class="dot w-5 h-5 bg-black rounded-full m-1"
          style="flex: 0 0 33%; aspect-ratio: 1"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    top: {
      type: Number,
      required: true,
    },
    bottom: {
      type: Number,
      required: true,
    },
  },
  computed: {
    topDots() {
      return Array(this.top).fill(0)
    },
    bottomDots() {
      return Array(this.bottom).fill(0)
    },
  },
}
</script>

<style scoped>
/* No additional styles needed as Tailwind CSS is used */
</style>
