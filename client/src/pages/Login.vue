<template>
  <div class="login-container">
    <div class="login-card">
      <h2>🔐 Connexion</h2>

      <p class="subtitle">Connectez-vous pour accéder à EVENTFLOW</p>

      <form @submit.prevent="handleLogin">
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

        <BaseButton class="login-btn"> Se connecter </BaseButton>
      </form>

      <div class="demo-accounts">
        <p><strong>Comptes de test :</strong></p>
        <small>admin@test.com</small><br />
        <small>orga1@test.com</small><br />
        <small>part1@test.com</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import BaseButton from "../components/BaseButton/BaseButton.vue";

const email = ref("");
const password = ref("");
const error = ref("");

const userStore = useUserStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    error.value = "";

    await userStore.login(email.value, password.value);

    router.push("/dashboard");
  } catch (err) {
    error.value =
      err.response?.data?.message || "Email ou mot de passe incorrect";
  }
};
</script>

<style scoped>
/* Background global */
.login-container {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Card */
.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 350px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

/* Title */
.login-card h2 {
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
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

/* Button */
.login-btn {
  width: 100%;
  display: block;
}

/* Error */
.error {
  color: red;
  font-size: 13px;
  margin-bottom: 10px;
}

/* Demo accounts */
.demo-accounts {
  margin-top: 20px;
  font-size: 12px;
  color: #777;
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
