/*
 * @Author: qiansc
 * @Date: 2018-11-05 20:08:22
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-06 10:28:38
 */
import {ClientRequestArgs, request} from "http";
import {Observable} from "rxjs";

export function fromHttp(reqOption: string | ClientRequestArgs, resOption: ResponseOption = {}) {
  return new Observable<Buffer>((subscriber) => {
    const req = request(reqOption, (res) => {
      res.setEncoding(resOption.encoding || "utf8");
      // if (resOption.timeout) {
      //   res.setTimeout(resOption.timeout, () => {subscriber.error("Http response timeout!"); });
      // }
      res.on("data", (chunk) => {
        subscriber.next(chunk);
      });
      res.on("end", () => {subscriber.complete(); });
    });
    req.on("error", (err) => {
      subscriber.error(err);
    });
    req.on("timeout", (err) => {
      subscriber.error(new Error("Http request timeout!"));
      req.destroy();
    });
    req.end();
  });
}
interface ResponseOption {
  encoding?: string;
  // timeout?: number;
}
