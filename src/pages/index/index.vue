<template>
  <view class="content">{{ title }}</view>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  const title = ref("Hello");
</script>
