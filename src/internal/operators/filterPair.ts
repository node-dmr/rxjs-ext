/*
 * @Author: qiansc
 * @Date: 2018-11-13 15:27:43
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-13 15:36:45
 */
import {Observable, OperatorFunction} from "rxjs";
import {filter } from "rxjs/operators";
import {Pair} from "../types";

export function filterPair(...indexs: string[]): OperatorFunction<Pair, Pair> {
  const map: {[index: string]: boolean} = {};
  indexs.forEach((index) => {map[index] = true; });
  return function FilterPairOperation(source: Observable<Pair>): Observable<Pair> {
    return source.pipe(filter(
      (p: Pair) => !!map[p[0]],
    ));
  };
}
