<template>
  <nav class="navbar">
    <router-link to="/">Home</router-link>

    <div v-if="!userStore.token">
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </div>

    <div v-else>
      <router-link to="/dashboard">Dashboard event</router-link>
      <router-link v-if="userStore.isAdmin" to="/users">
        Gestion utilisateurs
      </router-link>
      <button @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script src="./Navbar.js"></script>

<style scoped src="./Navbar.css"></style>
