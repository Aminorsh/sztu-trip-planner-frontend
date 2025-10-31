import { defineStore } from 'pinia'

export const useTripStore = defineStore('trip', {
  state: () => ({
    currentTrip: null,  // 当前打开的行程数据
    tripList: []        // 用户所有行程列表
  }),
  actions: {
    setCurrentTrip(trip) {
      this.currentTrip = trip
    },
    setTripList(list) {
      this.tripList = list
    }
  }
})
