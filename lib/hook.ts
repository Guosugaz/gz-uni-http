/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:24:50
 * @LastEditTime: 2022-08-27 21:33:48
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

  brforeRquest(callback: BreforeRquestCallback) {
    this.brforeRquestList.push(callback);
  }

  beforeInterceptorResponse(callback: BeforeInterceptorResponseCallback) {
    this.beforeInterceptorResponseList.push(callback);
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
}

export default new Hook();
