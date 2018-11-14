/*
 * @Author: qiansc
 * @Date: 2018-11-14 18:21:30
 * @Last Modified by:   qiansc
 * @Last Modified time: 2018-11-14 18:21:30
 */
import { Observable, OperatorFunction } from "rxjs";
import { map} from "rxjs/operators";
import { Pair } from "../types";
import { expression } from "../util";

/* tslint:disable:max-line-length */
export function modifyPair(indexExprLike?: string, valueExprLike?: string): OperatorFunction<Pair , Pair> {
  const indexExpr = indexExprLike === undefined ? undefined : expression.resolve(indexExprLike);
  const valueExpr = valueExprLike === undefined ? undefined : expression.resolve(valueExprLike);

  return function ModifyOperation(source: Observable<Pair>): Observable<Pair> {
    return source.pipe(map(([index, value]) => {
      const scope = {index, value};
      return [
        indexExpr ? indexExpr(scope) : index,
        valueExpr ? valueExpr(scope) : value,
      ] as Pair;
    }));
  };
}
