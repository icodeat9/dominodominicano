import { defineStore } from 'pinia'
import {
  fetchTables,
  createTable,
  joinTable,
  leaveTable,
  destroyTable,
} from '../services/tableService'
import { useUserStore } from './userStore'
import consumer from '../cable'

export const useTableStore = defineStore('tableStore', {
  state: () => ({
    openTables: [],
  }),
  getters: {
    currentUserTable(state) {
      const userStore = useUserStore()
      const currentUser = userStore.currentUser
      return state.openTables.find((table) =>
        table.users.some((user) => user.id === currentUser.id),
      )
    },
  },
  actions: {
    async loadTables() {
      this.openTables = await fetchTables()
      consumer.subscriptions.create('TablesChannel', {
        received: (data) => {
          if (data.action === 'create' && data.table) {
            this.openTables.push(data.table)
          } else if (data.action === 'join' && data.table) {
            const table = this.openTables.find((t) => t.id === data.table.id)
            if (table) {
              table.users = data.table.users
            }
          } else if (data.action === 'leave' && data.table) {
            const table = this.openTables.find((t) => t.id === data.table.id)
            if (table) {
              table.users = data.table.users
              if (table.users.length === 0) {
                this.openTables = this.openTables.filter((t) => t.id !== table.id)
              }
            }
          }
        },
      })
    },
    async createTable(tableName) {
      const newTable = await createTable(tableName)
      await this.joinTable(newTable.id)
    },
    async joinTable(tableId) {
      const userStore = useUserStore()
      const currentUser = userStore.currentUser

      if (this.currentUserTable) {
        await this.leaveTable()
      }

      await joinTable(tableId, currentUser.id)
    },
    async leaveTable() {
      const userStore = useUserStore()
      const currentUser = userStore.currentUser

      const currentTable = this.currentUserTable
      if (currentTable) {
        await leaveTable(currentTable.id, currentUser.id)
        currentTable.users = currentTable.users.filter((user) => user.id !== currentUser.id)
        if (currentTable.users.length === 0) {
          await destroyTable(currentTable.id)
          this.openTables = this.openTables.filter((table) => table.id !== currentTable.id)
        }
      }
    },
  },
})
