<script setup>
const appName = import.meta.env.VITE_APP_NAME;
</script>

<template>
  <nav class="navbar navbar-light bg-light mb-3">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        {{ appName }}
      </a>
    </div>
  </nav>
  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>
  <footer>

    <nav class="navbar navbar-light bg-light mb-3">
      <div class="container-fluid">
        <span class="navbar-text" style="margin-left: auto;margin-right: auto;">
          © 2024 <b>DevRand0m</b> | All rights reserved.
        </span>
      </div>
    </nav>
  </footer>
</template>

<style scoped></style>
