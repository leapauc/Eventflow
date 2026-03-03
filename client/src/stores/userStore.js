import { defineStore } from "pinia";
import { useRegistrationStore } from "./registrationStore";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: null,

    users: JSON.parse(localStorage.getItem("users")) || [
      { id: 1, name: "Admin", email: "admin@test.com", role: "admin" },
      { id: 2, name: "Orga 1", email: "orga1@test.com", role: "organisateur" },
      { id: 3, name: "Part 1", email: "part1@test.com", role: "participant" },
      { id: 4, name: "Orga 2", email: "orga2@test.com", role: "organisateur" },
      { id: 5, name: "Part 2", email: "part2@test.com", role: "participant" },
    ],
  }),

  getters: {
    isAdmin: (state) => state.user?.role === "admin",
    isOrganisateur: (state) => state.user?.role === "organisateur",
    isParticipant: (state) => state.user?.role === "participant",
  },

  actions: {
    // =====================
    // AUTH
    // =====================

    login(user, token) {
      this.user = user;
      this.token = token;
    },

    logout() {
      this.user = null;
      this.token = null;
    },

    // =====================
    // LOCAL STORAGE
    // =====================

    saveToLocalStorage() {
      localStorage.setItem("users", JSON.stringify(this.users));
    },

    // =====================
    // CRUD USERS
    // =====================

    getAllUsers() {
      return this.users;
    },

    getUserById(id) {
      return this.users.find((u) => u.id === id);
    },

    createUser({ name, email, role = "participant" }) {
      const newUser = {
        id: Date.now(),
        name,
        email,
        role,
      };

      this.users.push(newUser);
      this.saveToLocalStorage();

      return newUser;
    },

    updateUser(id, updatedData) {
      const index = this.users.findIndex((u) => u.id === id);
      if (index === -1) return;

      const oldRole = this.users[index].role;

      this.users[index] = {
        ...this.users[index],
        ...updatedData,
      };

      // 🔥 Si rôle change
      if (oldRole !== updatedData.role) {
        const registrationStore = useRegistrationStore();
        registrationStore.removeUserFromAllEvents(id);

        // 🔥 Si utilisateur connecté
        if (this.user && this.user.id === id) {
          this.user = { ...this.users[index] };
        }
      }

      this.saveToLocalStorage();
    },

    deleteUser(id) {
      const registrationStore = useRegistrationStore();

      registrationStore.removeUserFromAllEvents(id);

      this.users = this.users.filter((u) => u.id !== id);
      this.saveToLocalStorage();
    },
  },
});
