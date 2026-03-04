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

  emits: ["close", "success", "error"],

  setup(props, { emit }) {
    const eventStore = useEventStore();
    const userStore = useUserStore();

    const title = ref("");
    const description = ref("");
    const date = ref("");
    const location = ref("");
    const totalSeats = ref(1);

    /* --------------------------
       Remplissage mode edit
    --------------------------- */
    watch(
      () => props.eventData,
      (newVal) => {
        if (props.mode === "edit" && newVal) {
          title.value = newVal.title;
          description.value = newVal.description;
          date.value = newVal.date.split("T")[0];
          location.value = newVal.location;
          totalSeats.value = newVal.totalSeats ?? newVal.totalseats ?? 1;
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

    /* --------------------------
       Close
    --------------------------- */
    const handleClose = () => emit("close");

    /* --------------------------
       Submit
    --------------------------- */
    const handleSubmit = async () => {
      try {
        const userId = userStore.user?.id;

        if (props.mode === "create" && !userId) {
          emit("error", "create");
          return;
        }

        const eventPayload = {
          title: title.value,
          description: description.value,
          date: new Date(date.value).toISOString(),
          location: location.value,
          totalSeats: totalSeats.value,
        };

        if (props.mode === "create") {
          eventPayload.createdBy = userId;
          await eventStore.addEvent(eventPayload);
          emit("success", "create");
        }

        if (props.mode === "edit") {
          await eventStore.updateEvent(props.eventData.id_event, eventPayload);
          emit("success", "edit");
        }

        emit("close");
      } catch (error) {
        emit("error", props.mode);
      }
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
