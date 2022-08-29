/*
 * @Description: 内存缓存
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:25:31
 * @LastEditTime: 2022-08-29 15:37:51
 */
import { CacheData } from "../../types";
import { mapObject } from "../../utils";

class MemoryStore {
  store: Record<string, string> = {};

  getItem(key: string): CacheData {
    const item = this.store[key] || null;

    return item ? JSON.parse(item) : null;
  }

  setItem(key: string, value: CacheData) {
    this.store[key] = JSON.stringify(value);

    return value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }

  length() {
    return Object.keys(this.store).length;
  }

  iterate(fn: (...arg: any) => any) {
    return Promise.all(mapObject(this.store, fn));
  }
}

export default new MemoryStore();
