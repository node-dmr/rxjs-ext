/*
 * @Author: qiansc
 * @Date: 2018-11-11 18:57:42
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-12 15:31:55
 */
import { ConnectableObservable, Observable, OperatorFunction} from "rxjs";
import { buffer, concat, mergeAll, skip} from "rxjs/operators";

export function mergeBuffer<T>(pulsar: ConnectableObservable<any>): OperatorFunction<Observable<T>, T[]> {
  return (observables: Observable<Observable<T>>) => {
    // You should marvel at the magic of Rxjs when you read following.
    return observables.pipe(
      mergeAll(),
      buffer(pulsar.pipe(concat("0"))),
      skip(1),
    );
  };
}
