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
        props.event.id,
        userStore.user?.name,
      );
    });

    const buttonText = computed(() => {
      if (props.event.remainingSeats === 0) return "Complet";
      if (isRegistered.value) return "Déjà inscrit";
      return "S'inscrire";
    });

    const handleRegister = () => {
      if (props.event.remainingSeats <= 0) return;

      const success = eventStore.registerForEvent(props.event.id);

      if (success) {
        registrationStore.register(props.event.id, userStore.user?.name);
      }
    };

    const handleUnregister = () => {
      const userName = userStore.user?.name;

      registrationStore.unregister(props.event.id, userName);
      eventStore.unregisterFromEvent(props.event.id);
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
