<template>
  <view class="content">
    <button @click="userList">cache userList</button>
    <button @click="goodsList">goodsList</button>
    <button @click="error">error</button>
    <button @click="download">下载文件</button>
    <button @click="download">上传文件</button>
  </view>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { http } from "../../utils/request";
  import Http from "@sugaz/uni-http/packages/index";
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
    const res = await http.xhr({
      path: "/goodsList",
      method: "post",
      data: {
        test: "111111111"
      },
      cancelToken: token
    });
    console.log("goodsList", res);
  };

  const error = async () => {
    try {
      await http.xhr({
        url: "http://localhost:6780/error"
      });
    } catch (error) {
      console.log("------", error);
    }
  };

  const download = async () => {
    try {
      /* #ifdef H5 */
      const res = await http.xhr({
        url: "http://192.168.3.93:6780/file/table.xlsx",
        responseType: "arraybuffer"
      });
      let blob = new Blob([res]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "111.xlsx";
      link.click();
      window.URL.revokeObjectURL(link.href);
      /* #endif */
      /* #ifdef MP-WEIXIN */
      const res2 = await http.download({
        url: "http://192.168.3.93:6780/file/table.xlsx"
      });
      console.log("dddddddd", wx.env.USER_DATA_PATH);
      uni.openDocument({
        filePath: res2,
        fileType: "xlsx",
        showMenu: true,
        success(r: any) {
          console.log("rrrrrrrrrrr", r);
        }
      } as any);
      /* #endif */
    } catch (error) {
      console.log("2222222", error);
    }
  };
</script>
