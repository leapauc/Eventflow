<template>
  <div>
    <h2>Dashboard Events</h2>

    <BaseButton v-if="userStore.isOrganisateur" @click="openCreate">
      + Créer un événement
    </BaseButton>

    <div class="events-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id_event"
        :event="event"
        @edit="openEdit"
        @delete="openDelete"
        @full="handleFull"
      />
    </div>

    <!-- MODAL -->
    <EventModal
      :visible="showModal"
      :mode="modalMode"
      :eventData="selectedEvent"
      @close="closeModal"
    />

    <ConfirmModal
      :visible="showConfirm"
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useEventStore } from "../stores/eventStore";
import { useUserStore } from "../stores/userStore";

import EventCard from "../components/EventCard/EventCard.vue";
import EventModal from "../components/EventModal/EventModal.vue";
import BaseButton from "../components/BaseButton/BaseButton.vue";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal.vue";
import { useRegistrationStore } from "../stores/registrationStore";

const eventStore = useEventStore();
const userStore = useUserStore();
const registrationStore = useRegistrationStore();

const showModal = ref(false);
const modalMode = ref("create");
const showConfirm = ref(false);
const eventToDelete = ref(null);
const showFullModal = ref(false);
const selectedEvent = ref(null);

// Récupération des événements au chargement
onMounted(async () => {
  await eventStore.fetchEvents();
  if (userStore.user?.id) {
    await registrationStore.fetchRegistrations(userStore.user.id);
  }
});

// Tous les utilisateurs voient tous les événements
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

const openDelete = (event) => {
  eventToDelete.value = event;
  showConfirm.value = true;
};

const confirmDelete = () => {
  if (eventToDelete.value) {
    eventStore.deleteEvent(eventToDelete.value.id_event); // ← id_event
  }
  showConfirm.value = false;
  eventToDelete.value = null;
};

const handleFull = () => {
  showFullModal.value = true;
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
