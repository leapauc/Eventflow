<template>
  <div v-if="visible" class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h3>⚠ Confirmation</h3>

      <p>Êtes-vous sûr de vouloir supprimer cet événement ?</p>

      <div class="buttons">
        <button class="danger-btn" @click="$emit('confirm')">Supprimer</button>

        <button class="secondary-btn" @click="$emit('close')">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
});

defineEmits(["close", "confirm"]);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 350px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.danger-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.secondary-btn {
  background: #2563eb;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
