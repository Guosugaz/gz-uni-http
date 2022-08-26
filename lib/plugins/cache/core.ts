/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:33:49
 * @LastEditTime: 2022-08-26 17:51:54
 */
import type { RequsetOptions, Methods } from "../../types";
import { isDef } from "../../utils";

export function read() {}

export function write() {}

export function createKey(config = {} as RequsetOptions) {
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
  let res = false;
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
    config.cache.maxAge = config.cache.include.maxAge;
  }

  if (config.cache?.exclude) {
    let { paths } = config.cache.exclude;
    if (paths?.some((path) => new RegExp(path).test(config.url!))) {
      res = false;
    }
  }
  return res;
}
