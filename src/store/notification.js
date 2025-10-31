import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: []
  }),
  actions: {
    setNotifications(list) {
      this.notifications = list
    },
    addNotification(item) {
      this.notifications.unshift(item)
    }
  }
})
