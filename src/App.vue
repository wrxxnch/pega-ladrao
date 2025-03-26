<script setup>
import Loading from './components/Loading.vue';
</script>

<template>
  <!-- <nav class="navbar navbar-light bg-light mb-3">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        {{ appName }}
      </a>
    </div>
  </nav> -->
  <main>
    <RouterView />
  </main>
  <!-- <footer>

    <nav class="navbar navbar-light bg-light text-center mb-3">
      <div class="container-fluid">
        <span class="navbar-text" style="margin-left: auto;margin-right: auto;">
          © 2024 <b>DevRand0m</b> | All rights reserved.<br>
          <img :src="ssl">
        </span>
      </div>
    </nav>
  </footer>-->
  <Loading />
</template>

<style scoped></style>
