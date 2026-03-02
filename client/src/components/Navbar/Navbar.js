import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";

export default {
  name: "Navbar",

  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const logout = () => {
      userStore.logout(); // supprimer token + user
      router.push("/"); // redirection vers Home
    };

    return {
      userStore,
      logout,
    };
  },
};
