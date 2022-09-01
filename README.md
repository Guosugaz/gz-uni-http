# :rocket: gz-uni-http

> 应在在 uniapp 的请求工具，支持请求拦截和数据缓存

## Install

Using npm

```sh
npm install --save @sugaz/uni-http
```

Using yarn

```sh
yarn add @sugaz/uni-http
```

## 基础使用

`method` 可以设置请求方式，默认是 get

```js
// request.js
import Http from "@sugaz/uni-http";

export const http = new Http({
  baseUrl: "http://xxx.com"
});

// 请求前拦截
http.interceptor.request((config) => {
  return config;
  // 如果conifg有问题就throw取消请求
  // throw { aaa: 1 };
});

// 返回数据拦截
http.interceptor.response(
  (res) => {
    // throw { test: "error" };
    console.log(res);
    return res.data.data;
  },
  (err) => {
    return err;
  }
);

export default http;
```

```js
// vue文件
<script>
import http from "./request.js";

export default {
  async created() {
    try {
      const res = await http.xhr({
        path: "/userinfo",
        method: "get", // 默认get请求
        data: {
          name: "小明"
        }
      });
    } catch (error) {
      // handle error
    }
  },
}
</script>
```

## 全域名请求

使用 `url` 可以直接请求对应的 api，跳过 `baseUrl` 和 `path` 的拼接 api

```js
import Http from "@sugaz/uni-http";

export const http = new Http();

http.xhr({
  url: "http://xxx.com/test",
  method: "get",
  data: {
    name: "小红"
  }
});
```

## 数据缓存

```js
import Http from "@sugaz/uni-http";
import cacheInstall from "@sugaz/uni-http/plugins/cache";

export const http = new Http();

http.addPlugins(
  cacheInstall({
    // options
  })
);

http.xhr({
  url: "http://xxx.com/test",
  method: "get",
  cache: {
    maxAge: 10 * 1000 // 缓存10秒
  },
  data: {
    name: "小红"
  }
});
```
