import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    currentUser: {
      id: parseInt(localStorage.getItem('currentUserId')) || '', // Ensure user ID is an integer
      email: localStorage.getItem('currentUserEmail') || '', // Replace with actual user name
    },
    userToken: localStorage.getItem('userToken') || '', // Load userToken from local storage
  }),
  actions: {
    setCurrentUser(user) {
      this.currentUser = user
      localStorage.setItem('currentUserId', user.id) // Save currentUser id to local storage
      localStorage.setItem('currentUserEmail', user.email) // Save currentUser name to local storage
    },
    setUserToken(token) {
      this.userToken = token
      localStorage.setItem('userToken', token) // Save userToken to local storage
    },
    clearUserToken() {
      this.userToken = ''
      localStorage.removeItem('userToken') // Remove userToken from local storage
      localStorage.removeItem('currentUserId') // Remove currentUser id from local storage
      localStorage.removeItem('currentUserEmail') // Remove currentUser name from local storage
    },
  },
})
