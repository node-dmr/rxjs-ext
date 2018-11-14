/*
 * @Author: qiansc
 * @Date: 2018-11-14 17:23:00
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-15 00:40:26
 */
import { Observable, Operator, OperatorFunction, Subscriber } from "rxjs";
import { Pair } from "../types";
import { expression } from "../util";
import { StringExpr } from "../util/expression";

export function modifyPairInPairs(
  targetIndex: string | RegExp,
  newValueExpr: string, // $pairKeys / index / value
  newIndexExpr?: string,
  type?: string, // replace / add
  ): OperatorFunction<Pair[] , Pair[]> {
    const indexExpr = newIndexExpr === undefined ? undefined : expression.resolve(newIndexExpr);
    const valueExpr = expression.resolve(newValueExpr);

    return function ModifyPairInPairsOperation(source: Observable<Pair[]>): Observable<Pair[]> {
      return source.lift(new ModifyPairInPairsOperator(targetIndex, valueExpr, indexExpr, type));
    };
}

export class ModifyPairInPairsOperator implements Operator<Pair[], Pair[]> {
  constructor(
    private targetIndex: string | RegExp,
    private valueExpr: StringExpr,
    private indexExpr?: StringExpr,
    private type: string = "replace",
  ) {}
  public call(subscriber: Subscriber<Pair[]>, source: Observable<Pair[]>): any {
    source.subscribe(
      (pairs) => {
        const $: {[index: string]: string} = {};
        pairs.forEach((pair) => {
          $["$" + pair[0]] = pair[1];
        });
        const newArr: Pair[] = [];
        pairs.forEach((pair, i) => {
          if (
            (typeof this.targetIndex === "string" && pair[0] === this.targetIndex) ||
            (this.targetIndex instanceof RegExp && pair[0].match(this.targetIndex))) {
              $.index = pair[0];
              $.value = pair[1];
              const newPair: Pair = [
                this.indexExpr === undefined ? pair[0] : this.indexExpr($),
                this.valueExpr($),
              ];
              if (this.type === "add") {
                newArr.push(newPair);
              } else {
                pairs[i] = newPair;
              }
            }
        });
        if (newArr.length) {
          pairs = pairs.concat(newArr);
        }
        subscriber.next(pairs);
      },
      (err) => subscriber.error(err),
      () => subscriber.complete(),
    );
  }
}
