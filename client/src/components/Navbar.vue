<template>
  <nav class="navbar">
    <router-link to="/">Home</router-link>

    <div v-if="!userStore.token">
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </div>

    <div v-else>
      <router-link to="/dashboard">Dashboard</router-link>
      <button @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  userStore.logout(); // supprimer token + user
  router.push("/"); // 🔥 redirection vers Home
};
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: #1e293b;
}

a {
  color: white;
  margin-right: 10px;
  text-decoration: none;
}

button {
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
