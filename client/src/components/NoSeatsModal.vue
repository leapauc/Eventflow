<template>
  <div v-if="visible" class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h3>⚠ Événement complet</h3>

      <p>Désolé, il n'y a plus de places disponibles pour cet événement.</p>

      <button class="ok-btn" @click="$emit('close')">OK</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
});

defineEmits(["close"]);
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

.ok-btn {
  margin-top: 15px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
