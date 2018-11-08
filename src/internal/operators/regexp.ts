/*
 * @Author: qiansc
 * @Date: 2018-11-08 18:04:29
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 23:34:47
 */
import {Observable, OperatorFunction} from "rxjs";

export function regexp(patternOrRegExp: string | RegExp, flags?: string): OperatorFunction<string, string[]> {
  return function RegexpOperation(source: Observable<string>): Observable<string[]> {
    const reg: RegExp = typeof patternOrRegExp === "string" ? new RegExp(patternOrRegExp, flags) : patternOrRegExp;
    return new Observable((observer) => {
      source.subscribe(
        (origin) => {
          const result = origin.match(reg);
          if (result !== null) {
            observer.next(result);
          }
        },
        (err) => {observer.error(err); },
        () => {observer.complete(); },
      );
    });
  };
}
