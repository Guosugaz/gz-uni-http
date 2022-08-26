/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-26 15:14:20
 * @LastEditTime: 2022-08-26 17:52:31
 */
import Request from "../../Request";
import hook from "../../hook";
import { defaultConfig } from "./config";
import type { CacheOptions } from "../../types";
import { deepMerge, isFunction, isString } from "../../utils";
import store from "./memory-store";
import { createKey, invalidate } from "./core";

export default function install(options = {} as CacheOptions) {
  return function (requset: Request) {
    requset.updateConfig({
      cache: deepMerge(defaultConfig, options)
    });

    // 请求之前
    hook.brforeRquest((config) => {
      let isCache = false;
      const cache = config.cache!;
      // 判断能否缓存
      if (cache?.invalidate) {
        isCache = cache.invalidate(config);
      } else {
        isCache = invalidate(config);
      }

      if (!isCache) return;

      // 生成缓存key
      if (cache.key && isFunction(cache.key)) {
        config.cacheKey = cache.key(config);
      } else if (cache.key && isString(cache.key)) {
        config.cacheKey = cache.key;
      } else {
        config.cacheKey = createKey(config);
      }
      // 设置缓存时间
      if (!cache.maxAge && cache.include.maxAge) {
        cache.maxAge = cache.include.maxAge;
      }
      //   else {
      //     // 如果不用缓存就释放之前按缓存的内存
      //     store.removeItem(config.cacheKey);
      //     delete config.cacheKey;
      //   }
    });

    hook.beforeInterceptorResponse((res) => {
      if (res?.statusCode === 200) {
      }
    });
  };
}
