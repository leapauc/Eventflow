import { defineStore } from "pinia";

export const useRegistrationStore = defineStore("registration", {
  state: () => ({
    registrations: JSON.parse(localStorage.getItem("registrations")) || [],
  }),

  actions: {
    saveToLocalStorage() {
      localStorage.setItem("registrations", JSON.stringify(this.registrations));
    },

    register(eventId, userName) {
      this.registrations.push({
        eventId,
        userName,
      });

      this.saveToLocalStorage();
    },

    unregister(eventId, userName) {
      this.registrations = this.registrations.filter(
        (r) => !(r.eventId === eventId && r.userName === userName),
      );

      this.saveToLocalStorage();
    },

    isUserRegistered(eventId, userName) {
      return this.registrations.some(
        (r) => r.eventId === eventId && r.userName === userName,
      );
    },
  },
});
