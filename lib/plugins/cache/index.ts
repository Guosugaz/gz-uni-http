/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-26 15:14:20
 * @LastEditTime: 2022-09-03 19:58:43
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
      // 跳过非普通请求或者数据流
      if (
        config.requestType !== "request" ||
        config.responseType === "arraybuffer"
      ) {
        return { pass: false };
      }
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

      let cacheData: any

      try {
        cacheData = read(config);
        cacheData.config = config;
      } catch (error) {
        if ((error as any).message === "Entry is expires") {
          store.removeItem(config.cacheKey);
        }
      }

      return cacheData ? { pass: isCache, data: cacheData } : { pass: false };
    });

    hook.successResponse((res) => {
      const { config } = res;
      let pass = !config.cacheKey; // 判断是否要缓存

      const responseType = config.responseType || "";

      if (config.requestType !== "request") {
        pass = false;
      } else {
        // 跳过数据流
        pass = ["arraybuffer", "blob"].some((i) => i === responseType);
      }

      if (config.cacheKey && !pass) {
        if (config.cache?.limit) {
          limit(config);
        }

        res.cache = write(res);
      }
    });

    hook.errorResponse((res) => {
      const { config } = res;
      let pass = !config.cacheKey; // 判断是否要缓存

      if (!pass) {
        if (config.cache?.debug) {
          debug("request-error-remove", config.cacheKey);
        }
        store.removeItem(config.cacheKey!);
      }
    });
  };
}
