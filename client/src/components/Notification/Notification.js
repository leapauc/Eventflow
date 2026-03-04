import { ref, watch } from "vue";

export default {
  name: "Notification",

  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "success", // success | error | warning
    },
    duration: {
      type: Number,
      default: 3000,
    },
  },

  setup(props, { emit }) {
    const visible = ref(true);

    const close = () => {
      visible.value = false;
      emit("close");
    };

    watch(
      () => props.message,
      () => {
        visible.value = true;
        setTimeout(close, props.duration);
      },
      { immediate: true },
    );

    return {
      visible,
    };
  },
};
