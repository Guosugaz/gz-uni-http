/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-25 17:24:50
 * @LastEditTime: 2022-08-25 18:19:04
 */
class Hook {
  private brforeRquest: Array<(config: any) => any> = [];

  triggerBrforeRquest(config: any) {
    this.brforeRquest.forEach((fn) => fn && fn(config));
  }
}

export default new Hook();
