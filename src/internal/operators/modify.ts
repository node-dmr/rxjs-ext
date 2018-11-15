/*
 * @Author: qiansc
 * @Date: 2018-11-14 16:58:36
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-15 17:12:43
 */
import { Observable, OperatorFunction } from "rxjs";
import { map} from "rxjs/operators";
import { expression } from "../util";

export function modify(exprLike: string): OperatorFunction<string , string> {
  const expr = expression.resolve(exprLike);
  return function ModifyOperation(source: Observable<string>): Observable<string> {
    return source.pipe(map((value) => expr({value})));
  };
}
