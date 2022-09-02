<template>
  <view class="content">
    <button @click="userList">userList</button>
    <button @click="goodsList">goodsList</button>
    <button @click="error">error</button>
    <button @click="file">file</button>
  </view>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { http } from "../../utils/request";
  import Http from "../../../lib/Request";
  const token = new Http.CancelToken();

  const userList = async () => {
    await http.xhr({
      path: "/userList",
      cancelToken: token,
      cache: {
        maxAge: 20 * 1000
      }
    });
  };

  const goodsList = async () => {
    await http.xhr({
      path: "/goodsList",
      cancelToken: token
    });
  };

  const error = async () => {
    try {
      await http.xhr({
        url: "http://localhost:7777/error"
      });
    } catch (error) {
      console.log("------", error);
    }
  };

  const file = async () => {
    try {
      // const res = await http.download({
      //   path: "/file/table.xlsx"
      // });
      // console.log(66666666, res);
      // const link = document.createElement("a");
      // link.href = window.URL.createObjectURL(res);
      // link.download = "111.xlsx";
      // link.click();
      // window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.log("2222222", error);
    }
  };
</script>
