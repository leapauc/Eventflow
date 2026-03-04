import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";

import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Dashboard from "../pages/Dashboard.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      role: ["admin", "organisateur", "participant"],
    },
  },
  {
    path: "/users",
    name: "UserManagement",
    component: () => import("../pages/UserManagement.vue"),
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const userStore = useUserStore();

  const isAuthenticated = !!userStore.token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return "/login";
  }

  if (to.meta.requiresAdmin && userStore.user?.role !== "admin") {
    return "/";
  }

  if (to.meta.role && !to.meta.role.includes(userStore.user?.role)) {
    return "/";
  }

  return true;
});

export default router;
