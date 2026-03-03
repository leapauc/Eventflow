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
          // Extraire juste la date YYYY-MM-DD pour input type="date"
          date.value = newVal.date.split("T")[0];
          location.value = newVal.location;
          totalSeats.value = newVal.totalSeats ?? newVal.totalSeats;
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

    const handleClose = () => emit("close");

    const handleSubmit = async () => {
      const userId = userStore.user?.id;

      // Vérifier que l'utilisateur est connecté
      if (props.mode === "create" && !userId) {
        alert("Erreur : utilisateur non connecté !");
        console.error("Utilisateur non connecté :", userStore.user);
        return;
      }

      // Construction de l'objet événement
      const eventPayload = {
        title: title.value,
        description: description.value,
        date: new Date(date.value).toISOString(),
        location: location.value,
        totalSeats: totalSeats.value,
      };

      if (props.mode === "create") {
        eventPayload.createdBy = userId; // <-- l'ID correct
        console.log("Création d'un nouvel événement :", eventPayload);
        await eventStore.addEvent(eventPayload);
      }

      if (props.mode === "edit") {
        console.log(
          "Mise à jour de l'événement ID:",
          props.eventData.id_event,
          eventPayload,
        );
        await eventStore.updateEvent(props.eventData.id_event, eventPayload);
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
