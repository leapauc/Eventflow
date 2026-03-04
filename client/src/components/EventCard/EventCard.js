import { computed, ref } from "vue";
import { useUserStore } from "../../stores/userStore";
import * as registrationStore_1 from "../../stores/registrationStore";
import Notification from "../Notification/Notification.vue";

export default {
  name: "EventCard",

  components: {
    Notification,
  },

  props: {
    event: {
      type: Object,
      required: true,
    },
  },

  emits: ["edit", "delete", "full"],

  setup(props, { emit }) {
    const userStore = useUserStore();
    const registrationStore = registrationStore_1.useRegistrationStore();

    /* --------------------------
       Notification state
    --------------------------- */

    const notificationMessage = ref("");
    const notificationType = ref("success");
    const showNotification = ref(false);

    const triggerNotification = (message, type = "success") => {
      notificationMessage.value = message;
      notificationType.value = type;
      showNotification.value = true;
    };

    /* --------------------------
       Computed
    --------------------------- */

    const isRegistered = computed(() => {
      return registrationStore.isUserRegistered(
        props.event.id_event,
        userStore.user?.id,
      );
    });

    const buttonText = computed(() => {
      if (isRegistered.value) return "Déjà inscrit";
      if (props.event.remaining_seats === 0) return "Complet";
      return "S'inscrire";
    });

    /* --------------------------
       Actions
    --------------------------- */

    const handleRegister = async () => {
      try {
        const userId = userStore.user?.id;
        if (!userId || props.event.remaining_seats <= 0) return;

        await registrationStore.register(props.event.id_event, userId);

        props.event.remaining_seats = Math.max(
          0,
          Number(props.event.remaining_seats) - 1,
        );

        triggerNotification("Inscription réussie ✅", "success");
      } catch (error) {
        triggerNotification("Erreur lors de l'inscription ❌", "error");
      }
    };

    const handleUnregister = async () => {
      try {
        const userId = userStore.user?.id;
        if (!userId) return;

        await registrationStore.unregister(props.event.id_event, userId);

        props.event.remaining_seats = Math.max(
          0,
          Number(props.event.remaining_seats) + 1,
        );

        triggerNotification("Désinscription réussie ✅", "warning");
      } catch (error) {
        triggerNotification("Erreur lors de la désinscription ❌", "error");
      }
    };

    const handleEdit = () => {
      emit("edit", props.event);
    };

    const handleDelete = () => {
      emit("delete", props.event);
    };

    return {
      userStore,
      isRegistered,
      buttonText,
      handleRegister,
      handleUnregister,
      handleEdit,
      handleDelete,
      notificationMessage,
      notificationType,
      showNotification,
    };
  },
};
