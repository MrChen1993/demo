<script setup lang="ts">

import {onMounted} from "vue";
import {init} from "./three";
import {initSpaces} from "./space"

onMounted(async()=>{
  init()

  initSpaces().catch(e=>console.error(e))

})


</script>

<template>
  <div id="three"></div>
</template>

<style scoped>
</style>
