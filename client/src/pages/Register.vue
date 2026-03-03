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

        <select v-model="role" required>
          <option disabled value="">Choisir un rôle</option>
          <option value="participant">Participant</option>
          <option value="organisateur">Organisateur</option>
        </select>

        <p v-if="error" class="error">{{ error }}</p>

        <BaseButton class="register-btn"> S'inscrire </BaseButton>
      </form>

      <div class="redirect-login">
        <small>
          Déjà un compte ?
          <router-link to="/login">Se connecter</router-link>
        </small>
      </div>
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
const role = ref("");
const error = ref("");

const router = useRouter();
const userStore = useUserStore();

const handleRegister = async () => {
  try {
    error.value = "";

    if (!name.value || !email.value || !password.value || !role.value) {
      error.value = "Tous les champs sont obligatoires";
      return;
    }

    // Vérification locale sécurité
    if (role.value !== "participant" && role.value !== "organisateur") {
      error.value = "Rôle invalide";
      return;
    }

    // Appel backend
    const response = await userStore.createUser({
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    });

    // Connexion automatique
    await userStore.login(email.value, password.value);

    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de l'inscription";
  }
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
  width: 350px;
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

/* Inputs + Select */
input,
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: 0.2s;
  font-size: 14px;
  background: white;
}

input:focus,
select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

/* Button */
.register-btn {
  width: 100%;
  display: block;
}

/* Error */
.error {
  color: red;
  font-size: 13px;
  margin-bottom: 10px;
}

/* Redirect link */
.redirect-login {
  margin-top: 20px;
  font-size: 13px;
  color: #777;
}

.redirect-login a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.redirect-login a:hover {
  text-decoration: underline;
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
