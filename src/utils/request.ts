/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-24 16:16:59
 * @LastEditTime: 2022-08-24 16:21:00
 */
import Http from "../../lib/Request";

const request = new Http({
  baseUrl: ""
});

request.interceptor.request = (options) => {};

request.interceptor.response = (res) => {};
