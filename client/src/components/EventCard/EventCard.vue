<template>
  <div class="card" :class="{ registered: isRegistered }">
    <!-- Badge pour inscrit -->
    <div v-if="isRegistered" class="badge">✔ Inscrit</div>

    <!-- Badge pour complet -->
    <div
      v-else-if="!isRegistered && event.remaining_seats < 1"
      class="badge_full"
    >
      Complet
    </div>

    <h3>{{ event.title }}</h3>

    <p>{{ event.description }}</p>
    <p>📅 {{ event.date.split("T")[0] }}</p>
    <p>📍 {{ event.location }}</p>
    <p>🎟 Total: {{ event.totalseats }}</p>
    <p>🟢 Restantes: {{ event.remaining_seats }}</p>

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
        v-if="
          userStore.isParticipant && !isRegistered && event.remaining_seats > 0
        "
        class="register-btn"
        @click="handleRegister"
      >
        S'inscrire
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
