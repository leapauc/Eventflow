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
        @click="$emit('delete', event)"
      >
        Supprimer
      </button>
      <button
        v-if="userStore.isAdmin || userStore.isOrganisateur"
        class="edit-btn"
        @click="$emit('edit', event)"
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

<script setup>
import { computed } from "vue";
import { useUserStore } from "../stores/userStore";
import { useEventStore } from "../stores/eventStore";
import { useRegistrationStore } from "../stores/registrationStore";

const userStore = useUserStore();
const eventStore = useEventStore();
const registrationStore = useRegistrationStore();

const props = defineProps({
  event: Object,
});

defineEmits(["edit", "delete", "full"]);

/* Vérifie si déjà inscrit */
const isRegistered = computed(() => {
  return registrationStore.isUserRegistered(
    props.event.id,
    userStore.user?.name,
  );
});

/* Texte dynamique bouton */
const buttonText = computed(() => {
  if (props.event.remainingSeats === 0) return "Complet";
  if (isRegistered.value) return "Déjà inscrit";
  return "S'inscrire";
});

/* Inscription */
const handleRegister = () => {
  if (props.event.remainingSeats <= 0) return;

  const success = eventStore.registerForEvent(props.event.id);

  if (success) {
    registrationStore.register(props.event.id, userStore.user?.name);
  }
};

/* Désinscription */
const handleUnregister = () => {
  const userName = userStore.user?.name;

  registrationStore.unregister(props.event.id, userName);

  eventStore.unregisterFromEvent(props.event.id);
};
</script>

<style>
/* Card */
.card {
  background: rgba(0, 0, 0, 0.08);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

/* Surbrillance si inscrit */
.card.registered {
  border: 2px solid #16a34a;
  background: #f0fdf4;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.card h3 {
  margin: 0;
}

.card p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

/* Badge */
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #16a34a;
  color: white;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

/* Boutons */
.card-buttons {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.card button {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s;
}

.card button:hover {
  opacity: 0.85;
}

.edit-btn {
  background: #2563eb;
  color: white;
}

.delete-btn {
  background: #dc2626;
  color: white;
}

.register-btn {
  background: #16a34a;
  color: white;
}

.unregister-btn {
  background: #f59e0b;
  color: white;
}
</style>
