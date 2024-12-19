import { useUserStore } from '@/store/userStore'

export const API_URL = 'http://localhost:3000/users/tokens'

export const getAuthHeaders = () => {
  const userStore = useUserStore()
  return { Authorization: `Bearer ${userStore.userToken}` }
}

export const getJsonHeaders = () => {
  return { 'Content-Type': 'application/json' }
}
