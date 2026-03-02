<template>
  <div v-if="visible" class="overlay" @click.self="handleClose">
    <div class="modal">
      <!-- Header -->
      <div class="modal-header">
        <h3>
          {{
            mode === "create" ? "Créer un événement" : "Modifier l'événement"
          }}
        </h3>

        <button class="close-btn" @click="handleClose">✖</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="modal-form">
        <input v-model="title" type="text" placeholder="Titre" required />

        <textarea
          v-model="description"
          placeholder="Description"
          required
        ></textarea>

        <input v-model="date" type="date" required />

        <input v-model="location" type="text" placeholder="Lieu" required />

        <input
          v-model.number="totalSeats"
          type="number"
          placeholder="Nombre de places"
          min="1"
          required
        />

        <!-- Buttons -->
        <div class="buttons">
          <button type="submit" class="primary-btn">
            {{ mode === "create" ? "Créer" : "Modifier" }}
          </button>

          <button type="button" class="secondary-btn" @click="handleClose">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script src="./EventModal.js"></script>

<style scoped src="./EventModal.css"></style>
