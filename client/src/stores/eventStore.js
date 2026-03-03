import { defineStore } from "pinia";
import api from "@/services/api"; // ton axios configuré

export const useEventStore = defineStore("event", {
  state: () => ({
    events: [],
    loading: false,
  }),

  actions: {
    // =====================
    // GET EVENTS FROM BACKEND
    // =====================
    async fetchEvents() {
      try {
        this.loading = true;

        const response = await api.get("/event");

        this.events = response.data;
      } catch (error) {
        console.error("FETCH EVENTS ERROR:", error);
      } finally {
        this.loading = false;
      }
    },

    // =====================
    // CREATE EVENT
    // =====================
    async addEvent(eventData) {
      try {
        await api.post("/event", eventData);
        await this.fetchEvents();
      } catch (error) {
        console.error(error.response?.data);
      }
    },

    // =====================
    // UPDATE EVENT
    // =====================
    async updateEvent(id_event, data) {
      try {
        await api.put(`/event/${id_event}`, data);
        // Mettre à jour le store local
        await this.fetchEvents();
      } catch (error) {
        console.error("UPDATE EVENT ERROR:", error.response?.data);
      }
    },
    // =====================
    // DELETE EVENT
    // =====================
    async deleteEvent(id) {
      try {
        await api.delete(`/event/${id}`);

        await this.fetchEvents();
      } catch (error) {
        console.error(error.response?.data);
      }
    },

    // =====================
    // REGISTER
    // =====================
    async registerForEvent(eventId, userId) {
      try {
        await api.post(`/event/${eventId}/register`, {
          id_user: userId,
        });

        await this.fetchEvents();

        return true;
      } catch (error) {
        console.error(error.response?.data);
        return false;
      }
    },

    // =====================
    // UNREGISTER
    // =====================
    async unregisterFromEvent(eventId, userId) {
      try {
        await api.delete(`/event/${eventId}/unregister`, {
          data: { id_user: userId },
        });

        await this.fetchEvents();
      } catch (error) {
        console.error(error.response?.data);
      }
    },
  },
});
