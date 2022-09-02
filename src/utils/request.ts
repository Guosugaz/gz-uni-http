/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-24 16:16:59
 * @LastEditTime: 2022-09-02 18:09:39
 */
import Http from "../../lib/Request";
import cachePlugin from "../../lib/plugins/cache";

export const http = new Http({
  baseUrl: "http://localhost:6780"
});

http.addPlugin(
  cachePlugin({
    debug: true,
    limit: 10
  })
);

http.interceptor.request((config) => {
  return config;
  // throw { aaa: 1 };
});

http.interceptor.response(
  (res) => {
    // throw { aaa: 1 };
    if (["arraybuffer", "blob"].some((i) => res.config.responseType === i)) {
      return res.data;
    }
    return res.data.data;
  },
  (err) => {
    return err;
  }
);
