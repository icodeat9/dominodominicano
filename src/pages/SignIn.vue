<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Log In</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Log In
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'
import userSessionService from '@/services/userSessionService'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const userStore = useUserStore()
    const router = useRouter()

    const handleSubmit = async () => {
      try {
        const response = await userSessionService.signIn(email.value, password.value)
        userStore.setCurrentUser(response.resource_owner)
        userStore.setUserToken(response.token)
        router.push({ name: 'DominoLobby' }) // Redirect to DominoLobby
      } catch (error) {
        console.error('Login failed:', error)
        // Handle login error (e.g., show error message)
      }
    }

    return {
      email,
      password,
      handleSubmit,
    }
  },
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
