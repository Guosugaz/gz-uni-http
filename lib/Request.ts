/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-24 14:38:25
 * @LastEditTime: 2022-08-26 18:00:04
 */
import hook from "./hook";
import type { RequsetOptions, Interceptor } from "./types";
import { deepMerge } from "./utils";

export default class {
  config: RequsetOptions;
  // 拦截器
  interceptor: Interceptor = {
    // 请求前的拦截
    request: undefined,
    // 请求后的拦截
    response: undefined
  };

  constructor(customConfig = {} as RequsetOptions) {
    this.config = {
      baseUrl: "", // 请求的根域名
      // 默认的请求头
      header: {},
      method: "GET",
      // 设置为json，返回后uni.request会对数据进行一次JSON.parse
      dataType: "json",
      // 此参数无需处理，因为5+和支付宝小程序不支持，默认为text即可
      responseType: "text",
      ...customConfig
    };
  }

  request(options = {} as RequsetOptions) {
    if (this.config.baseUrl && this.config.path && !options.url) {
      options.url = this.config.baseUrl + this.config.path;
    }

    options = deepMerge(this.config, options);

    hook.triggerBrforeRquest(options);

    // 检查请求拦截
    if (
      this.interceptor.request &&
      typeof this.interceptor.request === "function"
    ) {
      let interceptorRequest = this.interceptor.request(options);
      if (interceptorRequest === false) {
        // 返回一个处于pending状态中的Promise，来取消原promise，避免进入then()回调
        return new Promise(() => {});
      }
    }
    return new Promise((resolve, reject) => {
      options.complete = (response: UniNamespace.GeneralCallbackResult) => {
        hook.triggerBeforeInterceptorResponse(response);

        // 判断是否存在拦截器
        if (
          this.interceptor.response &&
          typeof this.interceptor.response === "function"
        ) {
          try {
            let resInterceptors = this.interceptor.response(response);
            resolve(resInterceptors);
          } catch (error) {
            reject(error);
          }
        } else {
          // 如果要求返回原始数据，就算没有拦截器，也返回最原始的数据
          resolve(response);
        }
      };
      uni.request(options as UniNamespace.RequestOptions);
    });
  }

  updateConfig(customConfig: RequsetOptions) {
    this.config = deepMerge(this.config, customConfig);
  }

  addPlugin(install: (requset: this) => void) {
    install(this);
  }
}
