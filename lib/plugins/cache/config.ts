/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-26 15:14:07
 * @LastEditTime: 2022-08-26 17:52:24
 */
import type { CacheOptions } from "../../types";

export const defaultConfig: CacheOptions = {
  maxAge: 0,
  limit: false,
  query: true,
  debug: false,
  include: {
    maxAge: 30 * 1000 // 默认缓存30秒
  }
};
