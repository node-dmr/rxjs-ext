/*
 * @Author: qiansc
 * @Date: 2018-11-08 19:30:12
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 20:51:38
 */
import {Observable, OperatorFunction} from "rxjs";

export function json<T>(lazy: boolean = false): OperatorFunction<string, T> {
  return function JsonOperation(source: Observable<string>): Observable<T> {
    return new Observable((observer) => {
      source.subscribe(
        (origin) => {
          let result = {};
          try {
            result = new Function("return " + origin)();
          } catch (e) {
            // do nothing
          }
          if (lazy) {
            Object.keys(result).forEach((key) => {
              result[key] = isJSON(result[key]) ? JSON.stringify(result[key]) : result[key].toString();
            });
          }
          observer.next(result as T);
        },
        (err) => {observer.error(err); },
        () => {observer.complete(); },
      );
    });
  };
}

/**
 * @hidden and @ignore
 * $0 ~ $9  matches RegExp.$
 */
function isJSON(obj: any): boolean {
  return !!(typeof(obj) === "object" &&
  Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length);
}
