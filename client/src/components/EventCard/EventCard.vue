<template>
  <div class="card" :class="{ registered: isRegistered }">
    <!-- Badge -->
    <div v-if="isRegistered" class="badge">✔ Inscrit</div>

    <h3>{{ event.title }}</h3>

    <p>{{ event.description }}</p>
    <p>📅 {{ event.date }}</p>
    <p>📍 {{ event.location }}</p>
    <p>🎟 Total: {{ event.totalSeats }}</p>
    <p>🟢 Restantes: {{ event.remainingSeats }}</p>

    <div class="card-buttons">
      <!-- Admin / Organisateur -->
      <button
        v-if="userStore.isAdmin || userStore.isOrganisateur"
        class="delete-btn"
        @click="handleDelete"
      >
        Supprimer
      </button>

      <button
        v-if="userStore.isAdmin || userStore.isOrganisateur"
        class="edit-btn"
        @click="handleEdit"
      >
        Modifier
      </button>

      <!-- Participant -->
      <button
        v-if="userStore.isParticipant && !isRegistered"
        class="register-btn"
        :disabled="event.remainingSeats === 0"
        @click="handleRegister"
      >
        {{ buttonText }}
      </button>

      <button
        v-if="userStore.isParticipant && isRegistered"
        class="unregister-btn"
        @click="handleUnregister"
      >
        Se désinscrire
      </button>
    </div>
  </div>
</template>

<script src="./EventCard.js"></script>

<style scoped src="./EventCard.css"></style>
