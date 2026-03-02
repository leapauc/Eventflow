<template>
  <Navbar />
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<style>
.container {
  padding: 20px;
}
</style>
