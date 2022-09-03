/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 18:19:10
 * @LastEditTime: 2022-09-03 21:48:51
 */

import type CancelToken from "./CancelToken";

export type Methods =
  | "options"
  | "get"
  | "head"
  | "post"
  | "put"
  | "delete"
  | "trace"
  | "connect"
  | "OPTIONS"
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT";

export interface CacheOptions {
  maxAge?: number;
  limit?: number;
  debug?: boolean;
  query?: boolean;
  key?: (config: RequsetOptions) => string | string; // 生成key
  invalidate?: (config: RequsetOptions) => boolean; // 验证规则
  include?: {
    paths?: string[];
    maxAge: number;
    methods?: Methods[];
  };
  exclude?: {
    paths?: string[];
  };
}

export type CacheData = {
  expires: number;
  data: any;
};

export type Response<T = any> = {
  status: number | null;
  data: T;
  errMsg: string;
  header: any;
  config: RequsetOptions;
  cache?: boolean;
};

// @see https://uniapp.dcloud.net.cn/api/request/request.html
export interface RequsetOptions {
  /**
   * 资源url
   */
  url?: string;
  baseUrl?: string;
  path?: string;
  requestType?: "request" | "downloadFile" | "uploadFile"; // 请求类型 默认是request
  /**
   * 请求的参数
   */
  data?: string | AnyObject | ArrayBuffer;
  /**
   * 设置请求的 header，header 中不能设置 Referer。
   */
  header?: any;
  /**
   * 默认为 GET
   * 可以是：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT
   */
  method?: Methods;
  /**
   * 超时时间
   */
  timeout?: number;
  /**
   * 如果设为json，会尝试对返回的数据做一次 JSON.parse
   */
  dataType?: string;
  /**
   * 设置响应的数据类型。合法值：text、arraybuffer
   */
  responseType?: "text" | "arraybuffer";
  /**
   * 验证 ssl 证书
   */
  sslVerify?: boolean;
  /**
   * 跨域请求时是否携带凭证
   */
  withCredentials?: boolean;
  /**
   * DNS解析时优先使用 ipv4
   */
  firstIpv4?: boolean;
  // -------------------------start upload options---------------------------------
  /**
   * 文件类型，image/video/audio，仅支付宝小程序，且必填。
   * - image: 图像
   * - video: 视频
   * - audio: 音频
   */
  fileType?: "image" | "video" | "audio";
  /**
   * 要上传的文件对象
   */
  file?: File;
  /**
   * 要上传文件资源的路径
   */
  filePath?: string;
  /**
   * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
   */
  name?: string;
  /**
   * 需要上传的文件列表。
   */
  files?: UniNamespace.UploadFileOptionFiles[];
  /**
   * HTTP 请求中其他额外的 form data
   */
  formData?: any;
  // -------------------------end upload options---------------------------------
  cancelToken?: CancelToken;
  cache?: CacheOptions; // 缓存配置
  cacheKey?: string;
  complete?: (result: UniNamespace.GeneralCallbackResult) => void;
}

export declare namespace Interceptor {
  type RequestCallback = (req: RequsetOptions) => RequsetOptions;

  type RequestInterceptor = (callback: RequestCallback) => void;

  type ResponseSuccessCallback = (res: Response) => any;
  type ResponseErrorCallback = (res: Response) => any;

  type ResponseInterceptor = (
    success: ResponseSuccessCallback,
    error?: ResponseErrorCallback
  ) => void;

  interface InterceptorType {
    request: RequestInterceptor;
    // 请求后的拦截
    response: ResponseInterceptor;
  }
}

export type BreforeRquestCallback = (
  config: RequsetOptions
) => Promise<BreforeRquestCallbackRes>;

export type BreforeRquestCallbackRes = {
  pass: boolean;
  data?: any;
};

export type BeforeInterceptorResponseCallback = (res: Response) => any;
