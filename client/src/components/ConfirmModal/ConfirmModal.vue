<template>
  <div v-if="visible" class="overlay" @click.self="handleClose">
    <div class="modal">
      <h3>⚠ Confirmation</h3>

      <p>Êtes-vous sûr de vouloir supprimer cet événement ?</p>

      <div class="buttons">
        <button class="danger-btn" @click="handleConfirm">Supprimer</button>

        <button class="secondary-btn" @click="handleClose">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script src="./ConfirmModal.js"></script>

<style scoped src="./ConfirmModal.css"></style>
