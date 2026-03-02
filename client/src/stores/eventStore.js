import { defineStore } from "pinia";

export const useEventStore = defineStore("event", {
  state: () => ({
    events: JSON.parse(localStorage.getItem("events")) || [],
  }),

  actions: {
    saveToLocalStorage() {
      localStorage.setItem("events", JSON.stringify(this.events));
    },

    async fetchEvents() {
      if (this.events.length === 0) {
        this.events = [
          {
            id: 1,
            title: "Vue Conference",
            description: "Conférence sur Vue 3",
            date: "2025-10-10",
            location: "Paris",
            totalSeats: 50,
            remainingSeats: 50,
            createdBy: "Admin",
          },
        ];

        this.saveToLocalStorage();
      }
    },

    addEvent(event) {
      this.events.push(event);
      this.saveToLocalStorage();
    },
    deleteEvent(id) {
      this.events = this.events.filter((event) => event.id !== id);
      this.saveToLocalStorage();
    },
    registerForEvent(eventId) {
      const event = this.events.find((e) => e.id === eventId);
      if (!event) return false;

      if (event.remainingSeats <= 0) return false;

      event.remainingSeats -= 1;
      this.saveToLocalStorage();

      return true;
    },
    unregisterFromEvent(eventId) {
      const event = this.events.find((e) => e.id === eventId);

      if (!event) return;

      // On évite de dépasser totalSeats
      if (event.remainingSeats < event.totalSeats) {
        event.remainingSeats += 1;
      }

      this.saveToLocalStorage();
    },
  },
});
