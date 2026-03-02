<template>
  <div>
    <h2>Dashboard Events</h2>

    <BaseButton
      v-if="userStore.isAdmin || userStore.isOrganisateur"
      @click="openCreate"
    >
      + Créer un événement
    </BaseButton>

    <div class="events-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
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

    <NoSeatsModal :visible="showFullModal" @close="showFullModal = false" />
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
import NoSeatsModal from "../components/NoSeatsModal/NoSeatsModal.vue";

const eventStore = useEventStore();
const userStore = useUserStore();

const showModal = ref(false);
const modalMode = ref("create");
const showConfirm = ref(false);
const eventToDelete = ref(null);
const showFullModal = ref(false);
const selectedEvent = ref(null);

onMounted(() => {
  eventStore.fetchEvents();
});

const filteredEvents = computed(() => {
  if (userStore.isAdmin) {
    return eventStore.events;
  }

  if (userStore.isOrganisateur) {
    return eventStore.events.filter(
      (e) => e.createdBy === userStore.user?.name,
    );
  }

  return eventStore.events;
});

const openCreate = () => {
  modalMode.value = "create";
  selectedEvent.value = null;
  showModal.value = true;
};

const openEdit = (event) => {
  modalMode.value = "edit";
  selectedEvent.value = event;
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
    eventStore.deleteEvent(eventToDelete.value.id);
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
