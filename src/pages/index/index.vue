<template>
  <view class="content">
    <button @click="userList">userList</button>
  </view>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { http } from "../../utils/request";

  const userList = () => {
    http
      .xhr({
        path: "/userList",
        cache: {
          maxAge: 10 * 1000
        }
      })
      .then((res) => {
        console.log(res);
      });
  };
</script>
