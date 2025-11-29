<template>
  <div id="top_area">
    <NavBar />
  </div>
  <div id="main_area">
    <router-view/>
  </div>
</template>

<style>
#top_area {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 100;
}

#main_area {
  position: relative;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 76px;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  float: left;
  width: 80%;
}
</style>

<script setup>
import NavBar from '@/components/NavBar.vue';
</script>
