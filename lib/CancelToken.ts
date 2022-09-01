/*
 * @Description:
 * @Author: Guosugaz
 * @LastEditors: Guosugaz
 * @Date: 2022-08-31 15:17:46
 * @LastEditTime: 2022-09-01 14:13:56
 */

class CancelToken {
  private listeners: Array<UniNamespace.RequestTask> = [];
  private _loading = false;
  debug = false;

  constructor(options?: { debug?: boolean }) {
    options = options ?? {};
    this.debug = options.debug ?? false;
  }

  subscribe(task: UniNamespace.RequestTask) {
    this._debug("before subscribe listeners length: ", this.listeners.length);
    this.listeners.push(task);
    this._debug("affter subscribe listeners length: ", this.listeners.length);
  }

  unSubscribe(task: UniNamespace.RequestTask) {
    if (this._loading) return;
    const index = this.listeners.findIndex((i) => i.abort === task.abort);
    this._debug("before unSubscribe listeners length: ", this.listeners.length);
    if (index !== -1) {
      this.listeners.splice(index, 1);
      this._debug(
        "affter unSubscribe listeners length: ",
        this.listeners.length
      );
    }
  }

  cancel() {
    this._loading = true;
    this._debug("before cancel listeners length: ", this.listeners);
    this.listeners.forEach((c) => c.abort());
    this.listeners = [];
    this._loading = false;
    this._debug("affter cancel listeners length: ", this.listeners);
  }

  private _debug(...msg: any[]) {
    if (this.debug) {
      console.log(
        "%c http-cancel-debug：",
        "background: blue; color:#fff;",
        ...msg
      );
    }
  }
}

export default CancelToken;
