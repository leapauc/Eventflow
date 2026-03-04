import { computed } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useEventStore } from "../../stores/eventStore";
import * as registrationStore_1 from "../../stores/registrationStore";

export default {
  name: "EventCard",

  props: {
    event: {
      type: Object,
      required: true,
    },
  },

  emits: ["edit", "delete", "full"],

  setup(props, { emit }) {
    const userStore = useUserStore();
    const eventStore = useEventStore();
    const registrationStore = registrationStore_1.useRegistrationStore();

    const isRegistered = computed(() => {
      return registrationStore.isUserRegistered(
        props.event.id_event,
        userStore.user?.id,
      );
    });

    const buttonText = computed(() => {
      if (isRegistered.value) return "Déjà inscrit"; // priorité 1
      if (props.event.remaining_seats === 0) return "Complet"; // priorité 2
      return "S'inscrire";
    });

    const handleRegister = async () => {
      const userId = userStore.user?.id;
      if (!userId || props.event.remaining_seats <= 0) return;

      await registrationStore.register(props.event.id_event, userId);
      // Mettre à jour localement pour le rendu immédiat
      props.event.remaining_seats = Math.max(
        0,
        Number(props.event.remaining_seats) - 1,
      );
    };

    const handleUnregister = async () => {
      const userId = userStore.user?.id;
      if (!userId) return;

      await registrationStore.unregister(props.event.id_event, userId);
      props.event.remaining_seats = Math.max(
        0,
        Number(props.event.remaining_seats) + 1,
      );
    };

    const handleEdit = () => emit("edit", props.event);
    const handleDelete = () => emit("delete", props.event);

    return {
      userStore,
      isRegistered,
      buttonText,
      handleRegister,
      handleUnregister,
      handleEdit,
      handleDelete,
    };
  },
};
