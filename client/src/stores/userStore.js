import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === "admin",
    isOrganisateur: (state) => state.user?.role === "organisateur",
    isParticipant: (state) => state.user?.role === "participant",
  },

  actions: {
    login(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem("token", token);
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
