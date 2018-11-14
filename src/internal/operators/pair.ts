/*
 * @Author: qiansc
 * @Date: 2018-11-12 17:28:11
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-13 19:35:17
 */
import { Observable, Operator, OperatorFunction, Subscriber } from "rxjs";
import { Pair} from "../types";
import { expression } from "../util";
import { StringExpr } from "../util/expression";

/* tslint:disable:max-line-length */
export function pair(index?: number | string,  value?: number | string): OperatorFunction<string | string[], Pair>;

export function pair(index: number | string = 0,  value: number | string = 1):
OperatorFunction<string | string[], Pair> {
  let indexExpr: number | StringExpr;
  let valueExpr: number | StringExpr;
  if (typeof index === "number") {
    indexExpr = index as number;
  } else {
    indexExpr = expression.resolve(index as string);
  }
  if (typeof value === "number") {
    valueExpr = value as number;
  } else {
    valueExpr = expression.resolve(value as string);
  }

  return (source: Observable<string | string[]>): Observable<Pair> => {
    return source.lift(new PairOperator([indexExpr, valueExpr]));
  };
}

class PairOperator implements Operator<string | string[], Pair> {
  constructor(private expressions: [number | StringExpr, number | StringExpr]) {}
  public call(subscriber: Subscriber<Pair>, source: Observable<string | string[]>): any {
    source.subscribe(
      (item) => {
          const $ = {};
          if (typeof item === "string") {
            item = [item];
          }
          if (typeof this.expressions[0] !== "number" || typeof this.expressions[1] !== "number") {
            item.forEach((v, i) => {$["$" + i] = v; });
          }
          const index = typeof this.expressions[0] === "number" ? item[this.expressions[0] as number] : (this.expressions[0] as StringExpr)($);
          if (index === undefined || index === "" ) {return; }
          const value = typeof this.expressions[1] === "number" ? item[this.expressions[1] as number] : (this.expressions[1] as StringExpr)($);
          subscriber.next([index, value || "undefined"]);
      },
      (err) => {subscriber.error(err); },
      () => {subscriber.complete(); },
    );
  }
}
