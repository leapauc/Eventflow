<template>
  <div class="register-container">
    <div class="register-card">
      <h2>📝 Inscription</h2>

      <p class="subtitle">Créez votre compte EVENTFLOW</p>

      <form @submit.prevent="handleRegister">
        <input v-model="name" type="text" placeholder="Nom complet" required />

        <input v-model="email" type="email" placeholder="Email" required />

        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          required
        />

        <p v-if="error" class="error">
          {{ error }}
        </p>

        <BaseButton class="register-btn"> S'inscrire </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "../components/BaseButton/BaseButton.vue";
import { useUserStore } from "../stores/userStore";

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();

const userStore = useUserStore();

const handleRegister = () => {
  if (!name.value || !email.value || !password.value) {
    error.value = "Tous les champs sont obligatoires";
    return;
  }

  const existing = userStore.users.find(
    (u) => u.email.toLowerCase() === email.value.toLowerCase(),
  );

  if (existing) {
    error.value = "Email déjà utilisé";
    return;
  }

  const newUser = userStore.createUser({
    name: name.value,
    email: email.value,
    role: "participant",
  });

  userStore.login(newUser, "fake-token");

  router.push("/dashboard");
};
</script>

<style scoped>
/* Background */
.register-container {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Card */
.register-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 360px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

/* Title */
.register-card h2 {
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

/* Inputs */
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: 0.2s;
}

input:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
}

/* Button */
.register-btn {
  width: 100%;
  padding: 5px;
}
/* Error */
.error {
  color: red;
  font-size: 13px;
  margin-bottom: 10px;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
