/*
 * @Author: qiansc
 * @Date: 2018-11-14 10:15:02
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-14 12:08:48
 */
import { Observable, Operator, OperatorFunction, Subscriber } from "rxjs";
import { map } from "rxjs/operators";
import { Pair} from "../types";
import { expression } from "../util";
import { StringExpr } from "../util/expression";

/* tslint:disable:max-line-length */
export function pairFromJson(index: string): OperatorFunction<{[index: string]: any}, Pair>;
export function pairFromJson(indexExprLike: string,  valueExprLike: string): OperatorFunction<{[index: string]: any}, Pair>;

export function pairFromJson(indexOrExprLike: string,  valueExprLike?: string): OperatorFunction<{[index: string]: any}, Pair> {
  let indexExpr: StringExpr;
  let valueExpr: StringExpr;
  if (valueExprLike !== undefined) {
    indexExpr = expression.resolve(indexOrExprLike);
    valueExpr = expression.resolve(valueExprLike);
    return (source: Observable<{[index: string]: any}>): Observable<Pair> => {
      return source.lift(new PairFromJsonOperator(indexExpr, valueExpr));
    };
  } else {
    return (source: Observable<{[index: string]: any}>): Observable<Pair> => {
      return source.pipe(map((json) => {
        return [indexOrExprLike, json[indexOrExprLike] || "undefined"] as Pair;
      }));
    };
  }
}

class PairFromJsonOperator implements Operator<{[index: string]: any}, Pair> {
  constructor(private indexExpr: StringExpr, private valueExpr: StringExpr) {}
  public call(subscriber: Subscriber<Pair>, source: Observable<{[index: string]: any}>): any {
    source.subscribe(
      (item) => {
          const index = this.indexExpr(item);
          if (index === undefined || index === "" ) {return; }
          const value = this.valueExpr(item);
          subscriber.next([index, value || "undefined"]);
      },
      (err) => {subscriber.error(err); },
      () => {subscriber.complete(); },
    );
  }
}
