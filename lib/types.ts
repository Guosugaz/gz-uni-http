/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 18:19:10
 * @LastEditTime: 2022-08-25 18:19:11
 */
export interface RequsetOptions extends Omit<UniNamespace.RequestOptions, "url"> {
  baseUrl?: string;
  path?: string;
  url?: string;
}

export interface Interceptor {
  request?: (req: RequsetOptions) => false | void;
  response?: (res: UniNamespace.GeneralCallbackResult) => any;
}
