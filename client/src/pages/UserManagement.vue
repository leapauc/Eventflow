<template>
  <div class="container">
    <h2 class="title">🛡 Gestion des utilisateurs</h2>

    <div class="users-grid">
      <div v-for="user in userStore.users" :key="user.id" class="user-card">
        <div class="avatar">
          {{ user.name.charAt(0).toUpperCase() }}
        </div>

        <div class="info">
          <input v-model="user.name" @change="updateUser(user)" />

          <input v-model="user.email" @change="updateUser(user)" />

          <select v-model="user.role" @change="updateUser(user)">
            <option value="participant">Participant</option>
            <option value="organisateur">Organisateur</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button class="btn-delete" @click="deleteUser(user.id)">❌</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

const updateUser = (user) => {
  userStore.updateUser(user.id, {
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

const deleteUser = (id) => {
  userStore.deleteUser(id);
};
</script>

<style>
.container {
  padding: 30px;
}

.title {
  margin-bottom: 20px;
}

/* Grid */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Card */
.user-card {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: 0.2s;
}

.user-card:hover {
  transform: translateY(-4px);
}

/* Avatar */
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #16a34a);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
}

/* Infos */
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info input,
.info select {
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

/* Boutons */
.btn-primary {
  background: #16a34a;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-delete {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
</style>
