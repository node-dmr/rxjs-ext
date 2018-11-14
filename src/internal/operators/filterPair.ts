/*
 * @Author: qiansc
 * @Date: 2018-11-14 17:24:04
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-14 23:23:50
 */
import { Observable, OperatorFunction } from "rxjs";
import { filter } from "rxjs/operators";
import { Pair } from "../types";
import { expression } from "../util";

export function filterPair(exprLike: string): OperatorFunction<Pair , Pair> {
  const expr = expression.resolveBoolean(exprLike);
  return function ModifyOperation(source: Observable<Pair>): Observable<Pair> {
    return source.pipe(
      filter((p) => expr({index: p[0], value: p[1]})),
    );
  };
}
