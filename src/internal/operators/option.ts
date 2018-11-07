/*
 * @Author: qiansc
 * @Date: 2018-11-04 10:19:15
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-05 14:04:36
 */
import {Observable, Operator, OperatorFunction, Subscriber} from "rxjs";
import {expressions} from "../util";
/**
 * Applies config with enviroment emitted by the source
 * Observable, and emits the resulting option as an Observable.
 *
 * @param any config
 * @example
 * of({root: __dirname}).pipe(option("`${root}`"));
 * of(1, 2, 3).pipe(map(), option("`${root}`"));
 */
export function option<T, R>(config: R): OperatorFunction<T, R> {
  return function optionOperation(enviroment: Observable<T>): Observable<R> {
    return enviroment.lift(new OptionOperator<T, R>(config));
  };
}

export class OptionOperator<T, R> implements Operator<T, R> {
  constructor(private config: R) {
  }
  public call(subscriber: Subscriber<R>, source: any): any {
    return source.subscribe(new OptionSubscriber<T, R>(subscriber, this.config));
  }
}

class OptionSubscriber<T, R> extends Subscriber<T> {
  private expr: ((scope: {[index: string]: any}) => R);
  constructor(protected destination: Subscriber<R>, private config: R) {
    super(destination);
    this.expr =  expressions.resolve(config);
  }
  public _next(value: T) {
    this.destination.next(this.expr(value));
  }
}
