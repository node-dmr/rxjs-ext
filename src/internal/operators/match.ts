/*
 * @Author: qiansc
 * @Date: 2018-11-08 18:04:29
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-11 17:14:59
 */
import {Observable, OperatorFunction} from "rxjs";

export function match(patternOrRegExp: string | RegExp, flag?: string): OperatorFunction<string, string[]> {
  return function MatchOperation(source: Observable<string>): Observable<string[]> {
    const reg: RegExp = typeof patternOrRegExp === "string" ? new RegExp(patternOrRegExp, flag) : patternOrRegExp;
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
