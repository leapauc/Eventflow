import { ref, watch } from "vue";
import { useEventStore } from "../../stores/eventStore";
import { useUserStore } from "../../stores/userStore";

export default {
  name: "EventFormModal",

  props: {
    visible: Boolean,
    mode: String,
    eventData: Object,
  },

  emits: ["close"],

  setup(props, { emit }) {
    const eventStore = useEventStore();
    const userStore = useUserStore();

    const title = ref("");
    const description = ref("");
    const date = ref("");
    const location = ref("");
    const totalSeats = ref(1);

    // Remplissage automatique en mode edit
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

    const handleClose = () => {
      emit("close");
    };

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

          const usedSeats = event.totalSeats - event.remainingSeats;

          let newRemainingSeats = totalSeats.value - usedSeats;

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

    return {
      title,
      description,
      date,
      location,
      totalSeats,
      handleSubmit,
      handleClose,
    };
  },
};
