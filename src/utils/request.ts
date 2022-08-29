/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-24 16:16:59
 * @LastEditTime: 2022-08-29 17:43:35
 */
import Http from "../../lib/Request";
import cachePlugin from "../../lib/plugins/cache";

export const http = new Http({
  baseUrl: "http://localhost:6780"
});

http.addPlugin(cachePlugin());

http.interceptor.request = (options) => {};

http.interceptor.response = (res) => {
  if (String(res.status).startsWith("2")) {
    return res.data;
  } else {
    return Promise.reject("error");
  }
};
