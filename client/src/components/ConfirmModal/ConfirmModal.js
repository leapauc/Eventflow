export default {
  name: "ConfirmModal",

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },

  emits: ["close", "confirm"],

  methods: {
    handleClose() {
      this.$emit("close");
    },
    handleConfirm() {
      this.$emit("confirm");
    },
  },
};
