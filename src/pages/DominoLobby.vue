<template>
  <div class="lobby text-center p-5">
    <h1 class="text-3xl font-bold mb-5">Domino Lobby</h1>
    <div class="create-table mb-5">
      <h2 class="text-2xl mb-3">Create a New Table</h2>
      <form @submit.prevent="createTable" class="flex justify-center items-center">
        <input
          v-model="newTableName"
          placeholder="Table Name"
          required
          class="p-2 border border-gray-300 rounded mr-2"
        />
        <button type="submit" class="p-2 bg-green-500 text-white rounded hover:bg-green-600">
          Create Table
        </button>
      </form>
    </div>
    <div class="join-table">
      <h2 class="text-2xl mb-3">Join an Existing Table</h2>
      <DominoTableList
        :tables="tables"
        @joinTable="joinTable"
        @leaveTable="leaveTable"
        @startGame="startGame"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useTableStore } from '../store/tableStore'
import { useGameStore } from '../store/gameStore'
import DominoTableList from '../components/DominoTableList.vue'

export default defineComponent({
  name: 'DominoLobby',
  components: {
    DominoTableList,
  },
  setup() {
    const tableStore = useTableStore()
    const gameStore = useGameStore()
    const newTableName = ref('')

    const tables = computed(() => tableStore.openTables)

    onMounted(() => {
      tableStore.loadTables()
    })

    const createTable = async () => {
      await tableStore.createTable(newTableName.value)
      newTableName.value = ''
    }

    const joinTable = async (tableId: number) => {
      await tableStore.joinTable(tableId)
      console.log(`Joining table with ID: ${tableId}`)
    }

    const leaveTable = async () => {
      await tableStore.leaveTable()
      console.log(`Leaving table`)
    }

    const startGame = async (tableId: number) => {
      await gameStore.start(tableId)
      console.log(`Starting game for table with ID: ${tableId}`)
    }

    return {
      newTableName,
      tables,
      createTable,
      joinTable,
      leaveTable,
      startGame,
    }
  },
})
</script>
