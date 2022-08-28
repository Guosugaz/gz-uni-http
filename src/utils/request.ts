/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-24 16:16:59
 * @LastEditTime: 2022-08-28 11:30:37
 */
import Http from "../../lib/Request";

export const http = new Http({
  baseUrl: "http://localhost:6780"
});

http.interceptor.request = (options) => {};

http.interceptor.response = (res) => {
  if (String(res.status).startsWith("2")) {
    return res.data;
  } else {
    return Promise.reject("error");
  }
};
