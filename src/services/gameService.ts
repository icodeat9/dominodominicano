import { getAuthHeaders, getJsonHeaders } from './index'

const API_URL = 'http://localhost:3000'

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return await response.json()
}

export const startGame = async (tableId: number) => {
  try {
    const response = await fetch(`${API_URL}/tables/${tableId}/games`, {
      method: 'POST',
      headers: {
        ...getJsonHeaders(),
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ tableId }),
    })
    return await handleResponse(response)
  } catch (error) {
    throw new Error('Error starting game: ' + error.message)
  }
}

export const getGame = async (gameId: number) => {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}`, {
      method: 'GET',
      headers: {
        ...getJsonHeaders(),
        ...getAuthHeaders(),
      },
    })
    return await handleResponse(response)
  } catch (error) {
    throw new Error('Error getting game: ' + error.message)
  }
}

export const play = async (gameId: number, tile: any) => {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}/play`, {
      method: 'POST',
      headers: {
        ...getJsonHeaders(),
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ tile }),
    })
    return await handleResponse(response)
  } catch (error) {
    throw new Error('Error playing tile: ' + error.message)
  }
}

export const draw = async (gameId: number, tile: any) => {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}/draw`, {
      method: 'POST',
      headers: {
        ...getJsonHeaders(),
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ tile }),
    })
    return await handleResponse(response)
  } catch (error) {
    throw new Error('Error drawing tile: ' + error.message)
  }
}
