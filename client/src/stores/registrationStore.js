import { defineStore } from "pinia";
import api from "@/services/api";

export const useRegistrationStore = defineStore("registration", {
  state: () => ({
    loading: false,
    registrations: [], // ← pour savoir qui est inscrit
  }),

  getters: {
    // Vérifie si un utilisateur est inscrit à un événement
    isUserRegistered: (state) => {
      return (eventId, userId) => {
        return state.registrations.some(
          (r) => r.eventId === eventId && r.userId === userId,
        );
      };
    },
  },

  actions: {
    // =====================
    // INSCRIPTION
    // =====================

    async register(eventId, userId) {
      try {
        this.loading = true;

        await api.post(`/event/${eventId}/register`, {
          id_user: userId,
        });

        // mise à jour locale
        this.registrations.push({
          eventId,
          userId,
        });
      } catch (error) {
        console.error(error.response?.data);
      } finally {
        this.loading = false;
      }
    },

    // =====================
    // DESINSCRIPTION
    // =====================

    async unregister(eventId, userId) {
      try {
        this.loading = true;

        await api.delete(`/event/${eventId}/unregister`, {
          data: { id_user: userId },
        });

        // suppression locale
        this.registrations = this.registrations.filter(
          (r) => !(r.eventId === eventId && r.userId === userId),
        );
      } catch (error) {
        console.error(error.response?.data);
      } finally {
        this.loading = false;
      }
    },
  },
});
