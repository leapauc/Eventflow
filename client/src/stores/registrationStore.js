import { defineStore } from "pinia";
import { useEventStore } from "./eventStore";

export const useRegistrationStore = defineStore("registration", {
  state: () => ({
    registrations: JSON.parse(localStorage.getItem("registrations")) || [],
  }),

  actions: {
    // =====================
    // LOCAL STORAGE
    // =====================

    saveToLocalStorage() {
      localStorage.setItem("registrations", JSON.stringify(this.registrations));
    },

    // =====================
    // INSCRIPTION
    // =====================

    register(eventId, userId) {
      const alreadyRegistered = this.isUserRegistered(eventId, userId);

      if (alreadyRegistered) return;

      this.registrations.push({
        eventId,
        userId,
      });

      this.saveToLocalStorage();
    },

    // =====================
    // DESINSCRIPTION
    // =====================

    unregister(eventId, userId) {
      this.registrations = this.registrations.filter(
        (r) => !(r.eventId === eventId && r.userId === userId),
      );

      this.saveToLocalStorage();
    },

    // =====================
    // VERIFICATION
    // =====================

    isUserRegistered(eventId, userId) {
      return this.registrations.some(
        (r) => r.eventId === eventId && r.userId === userId,
      );
    },

    // =====================
    // SUPPRESSION UTILISATEUR
    // =====================

    removeUserFromAllEvents(userId) {
      const eventStore = useEventStore();

      // 🔥 Récupérer toutes les inscriptions de l'utilisateur
      const userRegistrations = this.registrations.filter(
        (r) => r.userId === userId,
      );

      // 🔥 Pour chaque inscription → remettre une place
      userRegistrations.forEach((r) => {
        const event = eventStore.events.find((e) => e.id === r.eventId);

        if (event) {
          // On remet une place seulement si nécessaire
          if (event.remainingSeats < event.totalSeats) {
            event.remainingSeats += 1;
          }
        }
      });

      // 🔥 Supprimer toutes les registrations de l'utilisateur
      this.registrations = this.registrations.filter(
        (r) => r.userId !== userId,
      );

      // 🔥 Sauvegarder les events
      eventStore.saveToLocalStorage();

      // 🔥 Sauvegarder les registrations
      this.saveToLocalStorage();
    },
  },
});
