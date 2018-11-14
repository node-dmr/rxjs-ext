/*
 * @Author: qiansc
 * @Date: 2018-11-13 12:36:28
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-13 14:01:44
 */
import { Observable, Operator, OperatorFunction, Subscriber } from "rxjs";

export function unzip<T>():
OperatorFunction<Iterable<T> | {[index: string]: T}, [string, T]> {
  return function UnzipOperation(source: Observable<Iterable<T>>): Observable<[string, T]> {
    return source.lift(new UnzipOperator());
  };
}

export class UnzipOperator<T> implements Operator<Iterable<T>, [string, T]> {
  public call(subscriber: Subscriber<[string, T]>, source: Observable<Iterable<T>>): any {
    source.subscribe(
      (item) => {
        Object.keys(item).forEach((index) => {
          subscriber.next([index.toString(), item[index]]);
        });
      },
      (err) => {subscriber.error(err); },
      () => {subscriber.complete(); },
    );
  }
}
