export default {
  name: "FullEventModal",

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },

  emits: ["close"],

  setup(props, { emit }) {
    const handleClose = () => {
      emit("close");
    };

    return {
      handleClose,
    };
  },
};
