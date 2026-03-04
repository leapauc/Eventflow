<template>
  <div>
    <Navbar @notify="showNotification" />

    <Notification
      v-if="notification.message"
      :message="notification.message"
      :type="notification.type"
      :duration="3000"
      @close="clearNotification"
    />

    <router-view />
  </div>
</template>

<script>
import { ref } from "vue";
import Notification from "./components/Notification/Notification.vue";
import Navbar from "./components/Navbar/Navbar.vue";

export default {
  components: {
    Notification,
    Navbar,
  },

  setup() {
    const notification = ref({
      message: "",
      type: "success",
    });

    const showNotification = (message, type = "success") => {
      notification.value = message;
    };

    const clearNotification = () => {
      notification.value.message = "";
    };

    return {
      notification,
      clearNotification,
      showNotification,
    };
  },
};
</script>
