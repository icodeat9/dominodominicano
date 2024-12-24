<template>
  <li
    class="mb-4 p-4 border rounded shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
  >
    <div class="flex justify-between items-center">
      <span class="font-bold text-lg text-gray-800"
        >{{ table.name }} ({{ table.users.length }}/2)</span
      >
      <div>
        <button
          v-if="!isUserInTable && !table.table_full"
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
          v-if="isUserInTable && table.table_full"
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
import { defineComponent, computed } from 'vue'
import { useUserStore } from '../store/userStore'

export default defineComponent({
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
  setup(props) {
    const userStore = useUserStore()
    const currentUser = computed(() => userStore.currentUser)
    const isUserInTable = computed(() =>
      props.table.users.some((user) => user.id === currentUser.value.id)
    )

    return {
      currentUser,
      isUserInTable,
    }
  },
})
</script>
