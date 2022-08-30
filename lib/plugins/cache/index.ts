/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-26 15:14:20
 * @LastEditTime: 2022-08-30 13:06:05
 */
import Request from "../../Request";
import hook from "../../hook";
import { defaultConfig } from "./config";
import type { CacheData, CacheOptions } from "../../types";
import { deepMerge } from "../../utils";
import store from "./memory-store";
import { createKey, debug, invalidate, limit, read, write } from "./core";

export default function install(options = {} as CacheOptions) {
  return function (requset: Request) {
    requset.updateConfig({
      cache: deepMerge(defaultConfig, options)
    });
    debug("cache-config", requset.config.cache);

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
      if (!cache.maxAge && cache.include?.maxAge) {
        cache.maxAge = cache.include.maxAge;
      }

      let cacheData = null as unknown as CacheData;

      try {
        cacheData = read(config);
      } catch (error) {
        if ((error as any).message === "Entry is expires") {
          store.removeItem(config.cacheKey);
        }
      }

      return cacheData ? { pass: isCache, data: cacheData } : { pass: false };
    });

    hook.beforeInterceptorResponse((res) => {
      let pass = !res.config.cacheKey; // 判断是否要缓存

      if (res.status === 200) {
        const responseType = res.config.responseType || "";
        // 跳过数据流
        pass = ["arraybuffer", "blob"].some((i) => i === responseType);

        if (res.config.cacheKey && !pass) {
          if (res.config.cache?.limit) {
            limit(res.config);
          }

          write(res);
        }
      } else {
        // 报错时删除对应的缓存
        if (!pass) {
          store.removeItem(res.config.cacheKey!);
        }
      }
    });
  };
}
