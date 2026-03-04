import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";

export default {
  name: "Navbar",

  emits: ["notify"],

  setup(props, { emit }) {
    const userStore = useUserStore();
    const router = useRouter();

    const logout = () => {
      const confirmLogout = confirm("Voulez-vous vraiment vous déconnecter ?");

      if (!confirmLogout) return;

      userStore.logout();
      router.push("/");

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
