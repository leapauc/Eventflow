import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";

export default {
  name: "Navbar",

  emits: ["notify"],

  setup(props, { emit }) {
    const userStore = useUserStore();
    const router = useRouter();

    const logout = () => {
      userStore.logout();
      router.push("/");

      // 🔔 Notification
      emit("notify", {
        message: "Déconnexion réussie 👋",
        type: "success",
      });
    };

    return {
      userStore,
      logout,
    };
  },
};
