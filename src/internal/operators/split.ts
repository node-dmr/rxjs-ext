/*
 * @Author: qiansc
 * @Date: 2018-11-08 18:04:29
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 19:02:25
 */
import {Observable, OperatorFunction} from "rxjs";

export function split(separater: string, keep: boolean = false): OperatorFunction<string, string[]> {
  return function SplitOperation(source: Observable<string>): Observable<string[]> {
    return new Observable((observer) => {
      source.subscribe(
        (origin) => {
          const result = origin.split(separater);
          if (result.length === 1 && !keep && origin.indexOf(separater) === -1) {
            // do nothing
          } else {
            observer.next(result);
          }
        },
        (err) => {observer.error(err); },
        () => {observer.complete(); },
      );
    });
  };
}
