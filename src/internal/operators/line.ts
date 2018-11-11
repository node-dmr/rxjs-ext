/*
 * @Author: qiansc
 * @Date: 2018-11-11 10:46:43
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-11 12:50:15
 */
import {Observable, Operator,  OperatorFunction, Subscriber} from "rxjs";
import {map} from "rxjs/operators";
import {bufferBreak} from "./bufferBreak";
import {toString} from "./toString";
export function line<T extends Buffer | string>(breaker: string = "\n"): OperatorFunction<T, string> {
  return function lineOperation(origin: Observable<T>): Observable<string> {
    return origin.pipe(map((chunk) => {
      if (typeof chunk === "string") {
        return new Buffer(chunk);
      }
      return chunk;
    }), bufferBreak(breaker), toString());
  };
}
