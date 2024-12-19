<template>
  <ul class="list-none p-0">
    <DominoTable
      v-for="table in tables"
      :key="table.id"
      :table="table"
      @joinTable="$emit('joinTable', table.id)"
      @leaveTable="$emit('leaveTable', table.id)"
      @startGame="$emit('startGame', table.id)"
    />
  </ul>
</template>

<script lang="ts">
import DominoTable from './DominoTable.vue'

export default {
  name: 'DominoTableList',
  components: {
    DominoTable,
  },
  props: {
    tables: {
      type: Array,
      required: true,
    },
  },
}
</script>
