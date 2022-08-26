/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:28:00
 * @LastEditTime: 2022-08-26 17:26:29
 */

export const isDef = <T = any>(value: T): value is NonNullable<T> => {
  return value !== undefined && value !== null;
};

export function getTag(value: any) {
  if (value === null) {
    return value === undefined ? "[object Undefined]" : "[object Null]";
  }
  return Object.prototype.toString.call(value);
}

export const isObject = (value: any): value is Object => {
  const type = typeof value;
  return value !== null && (type === "object" || type === "function");
};

export const isString = (value: any): value is string => {
  const type = typeof value;
  return (
    type === "string" ||
    (type === "object" &&
      value != null &&
      !Array.isArray(value) &&
      getTag(value) === "[object String]")
  );
};

export function isFunction(value: any): value is Function {
  if (!isObject(value)) {
    return false;
  }

  const tag = getTag(value);
  return (
    tag === "[object Function]" ||
    tag === "[object AsyncFunction]" ||
    tag === "[object GeneratorFunction]" ||
    tag === "[object Proxy]"
  );
}

function isArray(arr: any) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

export function mapObject(value: any, fn: (...arg: any) => any) {
  if (!isObject(value)) {
    return [];
  }
  return Object.keys(value).map((key) => fn(value[key], key));
}

export function deepClone(obj: any) {
  // 对常见的“非”值，直接返回原来值
  if ([null, undefined, NaN, false].includes(obj)) return obj;
  if (typeof obj !== "object" && typeof obj !== "function") {
    //原始类型直接返回
    return obj;
  }
  let o: any = isArray(obj) ? [] : {};
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
    }
  }
  return o;
}

export function deepMerge(target: any = {}, source: any = {}) {
  target = deepClone(target);
  if (!isObject(target) || !isObject(source)) return false;
  for (var prop in source) {
    if (!source.hasOwnProperty(prop)) continue;
    if (prop in target) {
      if (typeof target[prop] !== "object") {
        target[prop] = source[prop];
      } else {
        if (typeof source[prop] !== "object") {
          target[prop] = source[prop];
        } else {
          if (target[prop].concat && source[prop].concat) {
            target[prop] = target[prop].concat(source[prop]);
          } else {
            target[prop] = deepMerge(target[prop], source[prop]);
          }
        }
      }
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}
