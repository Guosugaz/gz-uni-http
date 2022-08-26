/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:24:50
 * @LastEditTime: 2022-08-26 15:10:09
 */
import type {
  RequsetOptions,
  BreforeRquestCallback,
  BeforeInterceptorResponseCallback
} from "./types";

class Hook {
  private brforeRquestList: Array<BreforeRquestCallback> = [];
  private beforeInterceptorResponseList: Array<BeforeInterceptorResponseCallback> =
    [];

  brforeRquest(callback: BreforeRquestCallback) {
    this.brforeRquestList.push(callback);
  }

  beforeInterceptorResponse(callback: BeforeInterceptorResponseCallback) {
    this.beforeInterceptorResponseList.push(callback);
  }

  triggerBrforeRquest(config: RequsetOptions) {
    this.brforeRquestList.forEach((fn) => fn && fn(config));
  }

  triggerBeforeInterceptorResponse(res: UniNamespace.GeneralCallbackResult) {
    this.beforeInterceptorResponseList.forEach((fn) => fn && fn(res));
  }

}

export default new Hook();
