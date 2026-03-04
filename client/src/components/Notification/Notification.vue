<template>
  <transition name="fade">
    <div v-if="visible" class="notification" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script src="./Notification.js"></script>
<style scoped src="./Notification.css"></style>
