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
            this.openTables = this.openTables.map((table) => {
              if (table.id === data.table.id) {
                table = data.table
              }
              return table
            })
          } else if (data.action === 'leave' && data.table) {
            this.openTables = this.openTables.map((table) => {
              if (table.id === data.table.id) {
                table = data.table
              }
              return table
            })
          }

          console.log({ data })
          console.log({ openTables: this.openTables })
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
      await joinTable(tableId, currentUser.id)
    },
    async leaveTable() {
      const userStore = useUserStore()
      const currentUser = userStore.currentUser

      const currentTable = this.currentUserTable
      await leaveTable(currentTable.id, currentUser.id)
    },
  },
})
