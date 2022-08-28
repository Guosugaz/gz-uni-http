/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:33:49
 * @LastEditTime: 2022-08-27 22:32:36
 */
import type { RequsetOptions, Methods } from "../../types";
import { isDef, isFunction, isString } from "../../utils";
import store from "./memory-store";

export function read(config: RequsetOptions) {
  let entry = store.getItem(config.cacheKey!);
  if (!entry || !entry.data) {
    const error = new Error();
    error.message = "Entry not found from cache";
    throw error;
  }

  const { expires, data } = entry;

  // 判断是否过期
  if (expires !== 0 && expires < Date.now()) {
    const error = new Error();
    error.message = "Entry is expires";
    store.removeItem(config.cacheKey!);
    throw error;
  }

  return data;
}

export function write(res) {
  const { config } = res;
  try {
    const entry = {
      expires: config.expires,
      data: res
    };

    config.store.setItem(config.uuid, entry);
  } catch (err) {
    config.debug("Could not store response", err);

    if (config.clearOnError) {
      try {
        config.store.clear();
      } catch (err) {
        config.debug("Could not clear store", err);
      }
    }

    return false;
  }

  return true;
}

export function createKey(config = {} as RequsetOptions) {
  const cache = config.cache!;

  if (cache.key && isFunction(cache.key)) {
    return cache.key(config);
  } else if (cache.key && isString(cache.key)) {
    return cache.key;
  }
  let key = config.baseUrl || "";
  key += config.path;
  if (config.url) key = config.url;
  if (config.data && config.cache?.query) {
    try {
      key += JSON.stringify(config.data);
    } catch (error) {
      //
    }
  }
  return key;
}

export function invalidate(config = {} as RequsetOptions) {
  const cache = config.cache!;
  let res = false;

  if (cache?.invalidate) {
    return cache.invalidate(config);
  }

  if (isDef(config.cache?.maxAge)) {
    res = true;
  } else if (config.cache?.include) {
    let { paths, methods } = config.cache.include;
    if (
      config.method &&
      methods &&
      methods.includes(config.method.toUpperCase() as Methods)
    ) {
      res = true;
    } else if (paths?.some((path) => new RegExp(path).test(config.url!))) {
      res = true;
    }
  }

  if (config.cache?.exclude) {
    let { paths } = config.cache.exclude;
    if (paths?.some((path) => new RegExp(path).test(config.url!))) {
      res = false;
    }
  }
  return res;
}
