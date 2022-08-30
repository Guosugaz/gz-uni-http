/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-24 14:38:25
 * @LastEditTime: 2022-08-30 17:22:00
 */
import hook from "./hook";
import type { RequsetOptions, Interceptor } from "./types";
import { deepMerge, formatNetworkResponse } from "./utils";

export default class {
  config: RequsetOptions;

  private requestInterceptor: Interceptor.RequestCallback | undefined;
  private responseSuccessInterceptor:
    | Interceptor.ResponseSuccessCallback
    | undefined;
  private responseErrorInterceptor:
    | Interceptor.ResponseErrorCallback
    | undefined;

  // 拦截器
  interceptor: Interceptor.InterceptorType = {
    // 请求前的拦截
    request: (callback) => {
      this.requestInterceptor = callback;
    },
    // 请求后的拦截
    response: (success, errror) => {
      this.responseSuccessInterceptor = success;
      if (errror) {
        this.responseErrorInterceptor = errror;
      }
    }
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

  xhr<T = any>(options = {} as RequsetOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.config.baseUrl && options.path && !options.url) {
        options.url = this.config.baseUrl + options.path;
      }

      options = deepMerge(this.config, options);

      // 请求前hook
      hook.triggerBrforeRquest(options).then((beRes) => {
        // 判断是否要跳过当前请求
        if (beRes.pass) {
          let data = beRes.data;
          if (this.responseSuccessInterceptor) {
            data = this.responseSuccessInterceptor(data);
          }
          resolve(data);
          return;
        }

        if (this.requestInterceptor) {
          try {
            options = this.requestInterceptor(options);
          } catch (error) {
            return reject(error);
          }
        }

        // 请求完成回调
        options.complete = (res: any) => {
          let response = formatNetworkResponse<T>(res, options);
          hook.triggerBeforeInterceptorResponse(response);

          // 请求成功
          if (
            response.errMsg === "request:ok" &&
            String(response.status).startsWith("2")
          ) {
            // 返回结果拦截
            if (this.responseSuccessInterceptor) {
              try {
                hook.triggerSuccessResponse(response);
                response = this.responseSuccessInterceptor(response);
                resolve(response as any);
              } catch (error) {
                hook.triggerErrorResponse(response);
                return reject(error);
              }
            } else {
              hook.triggerSuccessResponse(response);

              resolve(response.data);
            }
          } else {
            // 请求失败
            hook.triggerErrorResponse(response);
            if (this.responseErrorInterceptor) {
              const res = this.responseErrorInterceptor(response);
              reject(res);
            } else {
              reject(response);
            }
          }
        };
        uni.request(options as UniNamespace.RequestOptions);
      });
    });
  }

  updateConfig(customConfig: RequsetOptions) {
    this.config = deepMerge(this.config, customConfig);
  }

  addPlugin(install: (requset: this) => void) {
    install(this);
  }
}
