<template>
  <view class="content">
    <button @click="userList">userList</button>
    <button @click="goodsList">goodsList</button>
  </view>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { http } from "../../utils/request";

  const userList = async () => {
    try {
      const res = await http.xhr({
        path: "/userList"
        // cache: {
        //   maxAge: 2 * 1000
        // }
      });
      console.log(988888888, res);
    } catch (error) {
      console.log(99999999999, error);
    }
  };

  const goodsList = async () => {
    try {
      const res = await http.xhr({
        path: "/goodsList"
      });
      console.log(988888888, res);
    } catch (error) {
      console.log(8888888888, error);
    }
  };
</script>
