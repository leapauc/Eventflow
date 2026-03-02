<template>
  <div v-if="visible" class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <!-- Header -->
      <div class="modal-header">
        <h3>
          {{
            mode === "create" ? "Créer un événement" : "Modifier l'événement"
          }}
        </h3>

        <button class="close-btn" @click="$emit('close')">✖</button>
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

          <button type="button" class="secondary-btn" @click="$emit('close')">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useEventStore } from "../stores/eventStore";
import { useUserStore } from "../stores/userStore";

const props = defineProps({
  visible: Boolean,
  mode: String,
  eventData: Object,
});

const emit = defineEmits(["close"]);

const eventStore = useEventStore();
const userStore = useUserStore();

const title = ref("");
const description = ref("");
const date = ref("");
const location = ref("");
const totalSeats = ref(1);

/* Remplissage automatique en mode edit */
watch(
  () => props.eventData,
  (newVal) => {
    if (props.mode === "edit" && newVal) {
      title.value = newVal.title;
      description.value = newVal.description;
      date.value = newVal.date;
      location.value = newVal.location;

      totalSeats.value = newVal.totalSeats ?? newVal.remainingSeats;
    } else {
      title.value = "";
      description.value = "";
      date.value = "";
      location.value = "";
      totalSeats.value = 1;
    }
  },
  { immediate: true },
);

const handleSubmit = () => {
  if (props.mode === "create") {
    const newEvent = {
      id: Date.now(),
      title: title.value,
      description: description.value,
      date: date.value,
      location: location.value,
      totalSeats: totalSeats.value,
      remainingSeats: totalSeats.value,
      createdBy: userStore.user?.name,
    };

    eventStore.addEvent(newEvent);
  }

  if (props.mode === "edit") {
    const index = eventStore.events.findIndex(
      (e) => e.id === props.eventData.id,
    );

    if (index !== -1) {
      const event = eventStore.events[index];

      // Calcul du nombre de participants déjà inscrits
      const usedSeats = event.totalSeats - event.remainingSeats;

      // Nouvelle valeur restante
      let newRemainingSeats = totalSeats.value - usedSeats;

      // Sécurité : jamais négatif
      if (newRemainingSeats < 0) {
        newRemainingSeats = 0;
      }

      eventStore.events[index] = {
        ...event,
        title: title.value,
        description: description.value,
        date: date.value,
        location: location.value,
        totalSeats: totalSeats.value,
        remainingSeats: newRemainingSeats,
      };
    }
  }

  emit("close");
};
</script>

<style scoped>
/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s ease-in-out;
}

/* Modal */
.modal {
  background: white;
  width: 420px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.2s ease-in-out;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

/* Form */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

input,
textarea {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* Buttons */
.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.primary-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.secondary-btn {
  background: #dc2626;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
