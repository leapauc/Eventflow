import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import { useUserStore } from "./stores/userStore";

const app = createApp(App);

app.use(createPinia());
app.use(router);
const userStore = useUserStore();
userStore.init();
app.mount("#app");
