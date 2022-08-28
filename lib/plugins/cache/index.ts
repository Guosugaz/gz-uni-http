/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-26 15:14:20
 * @LastEditTime: 2022-08-28 15:00:10
 */
import Request from "../../Request";
import hook from "../../hook";
import { defaultConfig } from "./config";
import type { CacheOptions } from "../../types";
import { deepMerge } from "../../utils";
import store from "./memory-store";
import { createKey, invalidate, read } from "./core";

export default function install(options = {} as CacheOptions) {
  return function (requset: Request) {
    requset.updateConfig({
      cache: deepMerge(defaultConfig, options)
    });

    // 请求之前
    hook.brforeRquest(async (config) => {
      let isCache = false;
      const cache = config.cache!;
      // 判断能否缓存
      isCache = invalidate(config);

      // 生成缓存key
      config.cacheKey = createKey(config);

      if (!isCache) {
        // 如果不用缓存就释放之前按缓存的内存
        store.removeItem(config.cacheKey);
        delete config.cacheKey;
        return { pass: isCache };
      }

      // 设置缓存时间
      if (!cache.maxAge && cache.include.maxAge) {
        cache.maxAge = cache.include.maxAge;
      }

      let cacheData: any;

      try {
        cacheData = read(config);
      } catch (error) {
        //
      }

      return cacheData ? { pass: isCache, data: cacheData } : { pass: false };
    });

    hook.beforeInterceptorResponse((res) => {
      if (res.status === 200) {
      }
    });
  };
}
