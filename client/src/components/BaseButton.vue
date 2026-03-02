<template>
  <button class="base-button">
    <slot />
  </button>
</template>

<script setup></script>

<style scoped>
.base-button {
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #2563eb;
  color: white;
  transition: 0.2s;
}

.base-button:hover {
  opacity: 0.9;
}
</style>
