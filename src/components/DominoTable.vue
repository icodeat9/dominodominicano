<template>
  <li
    class="mb-4 p-4 border rounded shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
  >
    <div class="flex justify-between items-center">
      <span class="font-bold text-lg text-gray-800"
        >{{ table.name }} ({{ table.users.length }}/4)</span
      >
      <div>
        <button
          v-if="!isUserInTable && table.users.length < 4"
          @click="$emit('joinTable', table.id)"
          class="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Join
        </button>
        <button
          v-if="isUserInTable"
          @click="$emit('leaveTable', table.id)"
          class="ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
        >
          Leave
        </button>
        <button
          v-if="isUserInTable && table.users.length === 4"
          @click="$emit('startGame', table.id)"
          class="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
        >
          Start Game
        </button>
      </div>
    </div>
    <ul class="mt-2">
      <li v-for="user in table.users" :key="user.id" class="py-1">
        <span
          :class="{
            'text-green-500': user.id === currentUser.id,
            'text-gray-700': user.id !== currentUser.id,
          }"
        >
          {{ user.email }} <span v-if="user.id === currentUser.id">(You)</span>
        </span>
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
import { useUserStore } from '../store/userStore'

export default {
  name: 'DominoTable',
  props: {
    table: {
      type: Object,
      required: true,
      default: () => ({
        users: [],
      }),
    },
  },
  computed: {
    isUserInTable() {
      const userStore = useUserStore()
      const currentUser = userStore.currentUser
      return this.table.users.some((user) => user.id === currentUser.id)
    },
    currentUser() {
      const userStore = useUserStore()
      return userStore.currentUser
    },
  },
}
</script>
