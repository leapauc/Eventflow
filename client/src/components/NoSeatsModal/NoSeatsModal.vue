<template>
  <div v-if="visible" class="overlay" @click.self="handleClose">
    <div class="modal">
      <h3>⚠ Événement complet</h3>

      <p>Désolé, il n'y a plus de places disponibles pour cet événement.</p>

      <button class="ok-btn" @click="handleClose">OK</button>
    </div>
  </div>
</template>

<script src="./NoSeatsModal.js"></script>

<style scoped src="./NoSeatsModal.css"></style>
