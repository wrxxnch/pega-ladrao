<script setup>
const appName = import.meta.env.VITE_APP_NAME;
</script>

<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        {{ appName }}
      </a>
    </div>
  </nav>
</template>

<style scoped></style>
