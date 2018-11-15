/*
 * @Author: qiansc
 * @Date: 2018-11-14 18:21:30
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-15 17:29:01
 */
import { ConnectableObservable, Observable, ObservableInput , of, OperatorFunction } from "rxjs";
import { map, publish, zip, zipAll} from "rxjs/operators";
import { Pair } from "../types";

export function modifyPairWith(
  indexOperation?: OperatorFunction<string , string>,
  valueOperation?: OperatorFunction<string , string>,
  mergeOperation: OperatorFunction<ObservableInput<string>, Pair> = zipAll() as any,
): OperatorFunction<Pair , Pair> {
  return function ModifyPairWithOperation(source: Observable<Pair>): Observable<Pair> {
    return new Observable((observer) => {
      indexOperation = indexOperation || ((v) => v);
      valueOperation = valueOperation || ((v) => v);
      source.subscribe(
        (pair) => {
          of(pair[0]).pipe(indexOperation as OperatorFunction<string , string>).subscribe(
            (idx) => {
              of(pair[1]).pipe(valueOperation as OperatorFunction<string , string>).subscribe(
                (val) => {
                  observer.next([idx, val]);
                },
                (err) => observer.error(err),
              );
            },
            (err) => observer.error(err),
          );
        },
        (err) => observer.error(err),
        () => observer.complete(),
      );
    });
  };
}
