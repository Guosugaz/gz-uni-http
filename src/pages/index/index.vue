<template>
  <view class="content">
    <button @click="userList">userList</button>
  </view>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { http } from "../../utils/request";

  const userList = () => {
    http.xhr({
      path: "/userList"
    });
  };
</script>
