<template>
  <div>
    <h2>Dashboard Events</h2>

    <!-- Bouton création -->
    <BaseButton v-if="userStore.isOrganisateur" @click="openCreate">
      + Créer un événement
    </BaseButton>

    <!-- Liste des événements -->
    <div class="events-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id_event"
        :event="event"
        @edit="openEdit"
        @delete="openDelete"
      />
    </div>

    <!-- Modal Création / Edition -->
    <EventModal
      :visible="showModal"
      :mode="modalMode"
      :eventData="selectedEvent"
      @close="closeModal"
      @success="handleEventSuccess"
      @error="handleEventError"
    />

    <!-- Modal Confirmation Suppression -->
    <ConfirmModal
      :visible="showConfirm"
      @close="closeConfirm"
      @confirm="confirmDelete"
    />

    <!-- Notification globale -->
    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useEventStore } from "../stores/eventStore";
import { useUserStore } from "../stores/userStore";
import { useRegistrationStore } from "../stores/registrationStore";

import EventCard from "../components/EventCard/EventCard.vue";
import EventModal from "../components/EventModal/EventModal.vue";
import BaseButton from "../components/BaseButton/BaseButton.vue";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal.vue";
import Notification from "../components/Notification/Notification.vue";

/* -----------------------
   Stores
------------------------ */
const eventStore = useEventStore();
const userStore = useUserStore();
const registrationStore = useRegistrationStore();

/* -----------------------
   State
------------------------ */
const showModal = ref(false);
const modalMode = ref("create");
const selectedEvent = ref(null);

const showConfirm = ref(false);
const eventToDelete = ref(null);

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref("success");

/* -----------------------
   Lifecycle
------------------------ */
onMounted(async () => {
  await eventStore.fetchEvents();

  if (userStore.user?.id) {
    await registrationStore.fetchRegistrations(userStore.user.id);
  }
});

/* -----------------------
   Computed
------------------------ */
const filteredEvents = computed(() => {
  if (userStore.isAdmin) {
    return eventStore.events;
  } else if (userStore.isOrganisateur) {
    return eventStore.events.filter(
      (event) => event.organizer === userStore.user?.name,
    );
  } else {
    return eventStore.events;
  }
});

/* -----------------------
   Modal actions
------------------------ */
const openCreate = () => {
  modalMode.value = "create";
  selectedEvent.value = null;
  showModal.value = true;
};

const openEdit = (event) => {
  modalMode.value = "edit";

  selectedEvent.value = {
    ...event,
    date: event.date.split("T")[0],
    totalSeats: event.totalseats,
  };

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

/* -----------------------
   Delete logic
------------------------ */
const openDelete = (event) => {
  eventToDelete.value = event;
  showConfirm.value = true;
};

const closeConfirm = () => {
  showConfirm.value = false;
  eventToDelete.value = null;
};

const confirmDelete = async () => {
  if (!eventToDelete.value) return;

  try {
    await eventStore.deleteEvent(eventToDelete.value.id_event);

    notificationMessage.value = "Suppression réussie 🗑️";
    notificationType.value = "success";
    showNotification.value = true;
  } catch (error) {
    notificationMessage.value = "Erreur lors de la suppression ❌";
    notificationType.value = "error";
    showNotification.value = true;
  } finally {
    closeConfirm();
  }
};

/* -----------------------
   Add / Edit notifications
------------------------ */
const handleEventSuccess = async (mode) => {
  // Refresh liste après ajout / modification
  await eventStore.fetchEvents();

  if (mode === "create") {
    notificationMessage.value = "Événement créé avec succès 🎉";
  } else {
    notificationMessage.value = "Événement modifié avec succès ✏️";
  }

  notificationType.value = "success";
  showNotification.value = true;
};

const handleEventError = (mode) => {
  if (mode === "create") {
    notificationMessage.value = "Erreur lors de la création ❌";
  } else {
    notificationMessage.value = "Erreur lors de la modification ❌";
  }

  notificationType.value = "error";
  showNotification.value = true;
};
</script>

<style>
.events-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
