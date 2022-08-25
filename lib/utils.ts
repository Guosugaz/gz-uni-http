/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:28:00
 * @LastEditTime: 2022-08-25 17:49:17
 */

export function getTag(value) {
  if (value === null) {
    return value === undefined ? "[object Undefined]" : "[object Null]";
  }
  return Object.prototype.toString.call(value);
}

export const isObject = (value: any): value is Object | Function => {
  const type = typeof value;
  return value !== null && (type === "object" || type === "function");
};

export const isString = (
  value: any
): value is string | Record<string, string> => {
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

export function mapObject(value: any, fn: (...arg: any) => any) {
  if (!isObject(value)) {
    return [];
  }
  return Object.keys(value).map((key) => fn(value[key], key));
}
