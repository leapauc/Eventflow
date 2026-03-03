import { defineStore } from "pinia";
import api from "@/services/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    users: [],
    loading: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === "admin",
    isOrganisateur: (state) => state.user?.role === "organisateur",
    isParticipant: (state) => state.user?.role === "participant",
  },

  actions: {
    // =====================
    // LOGIN
    // =====================
    async login(email, password) {
      const response = await api.post("/user/auth/login", {
        email,
        password,
      });

      this.user = response.data.user;
      this.token = response.data.token; // 👈 important

      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("token", this.token);
    },

    // =====================
    // LOGOUT
    // =====================
    logout() {
      this.user = null;
      this.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    // =====================
    // REGISTER
    // =====================
    async createUser(userData) {
      const response = await api.post("/user/auth/register", userData);

      return response.data;
    },

    // =====================
    // GET USERS (admin)
    // =====================
    async fetchUsers() {
      const response = await api.get("/user");
      this.users = response.data;
    },

    // =====================
    // DELETE USER
    // =====================
    async deleteUser(id_user) {
      await api.delete(`/user/${id_user}`);

      await this.fetchUsers();

      if (this.user?.id_user === id_user) {
        this.logout();
      }
    },
  },
});
