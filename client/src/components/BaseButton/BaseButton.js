export default {
  name: "BaseButton",
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
