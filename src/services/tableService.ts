import { getAuthHeaders, getJsonHeaders } from './index'

const API_URL = 'http://localhost:3000'

export const fetchTables = async () => {
  const response = await fetch(`${API_URL}/tables`, {
    headers: getAuthHeaders(),
  })
  return response.json()
}

export const createTable = async (tableName: string) => {
  const response = await fetch(`${API_URL}/tables`, {
    method: 'POST',
    headers: {
      ...getJsonHeaders(),
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ table: { name: tableName } }),
  })
  return response.json()
}

export const joinTable = async (tableId: number, userId: string) => {
  const response = await fetch(`${API_URL}/tables/${tableId}/join`, {
    method: 'POST',
    headers: {
      ...getJsonHeaders(),
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ userId }),
  })
  return response.json()
}

export const leaveTable = async (tableId: number, userId: string) => {
  const response = await fetch(`${API_URL}/tables/${tableId}/leave`, {
    method: 'POST',
    headers: {
      ...getJsonHeaders(),
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ userId }),
  })
  return response.json()
}

export const destroyTable = async (tableId: number) => {
  const response = await fetch(`${API_URL}/tables/${tableId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return response.json()
}
