/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:24:50
 * @LastEditTime: 2022-08-30 17:05:28
 */
import type {
  RequsetOptions,
  BreforeRquestCallback,
  BeforeInterceptorResponseCallback,
  Response
} from "./types";

class Hook {
  private brforeRquestList: Array<BreforeRquestCallback> = [];
  private beforeInterceptorResponseList: Array<BeforeInterceptorResponseCallback> =
    [];
  private successResponseList: Array<BeforeInterceptorResponseCallback> = [];
  private errorResponseList: Array<BeforeInterceptorResponseCallback> = [];

  brforeRquest(callback: BreforeRquestCallback) {
    this.brforeRquestList.push(callback);
  }

  beforeInterceptorResponse(callback: BeforeInterceptorResponseCallback) {
    this.beforeInterceptorResponseList.push(callback);
  }

  successResponse(callback: BeforeInterceptorResponseCallback) {
    this.successResponseList.push(callback);
  }

  errorResponse(callback: BeforeInterceptorResponseCallback) {
    this.errorResponseList.push(callback);
  }

  async triggerBrforeRquest(config: RequsetOptions): Promise<{
    pass: boolean;
    data?: any;
  }> {
    const list = this.brforeRquestList.map((fn) => fn && fn(config));
    const res = await Promise.all(list);
    const findItem = res.find((i) => i.pass);
    return findItem || { pass: false };
  }

  triggerBeforeInterceptorResponse(res: Response) {
    this.beforeInterceptorResponseList.forEach((fn) => fn && fn(res));
  }

  triggerSuccessResponse(res: Response) {
    this.successResponseList.forEach((fn) => fn && fn(res));
  }

  triggerErrorResponse(res: Response) {
    this.errorResponseList.forEach((fn) => fn && fn(res));
  }
}

export default new Hook();
