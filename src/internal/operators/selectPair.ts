/*
 * @Author: qiansc
 * @Date: 2018-11-13 15:27:43
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-14 17:46:46
 */
import {Observable, OperatorFunction} from "rxjs";
import {filter } from "rxjs/operators";
import {Pair} from "../types";

export function selectPair(index: string): OperatorFunction<Pair, Pair>;
export function selectPair(index: string, ...indexs: string[]): OperatorFunction<Pair, Pair>;
export function selectPair(drop: boolean, ...indexs: string[]): OperatorFunction<Pair, Pair>;

export function selectPair(drop: boolean | string, ...indexs: string[]): OperatorFunction<Pair, Pair> {
  if (typeof drop === "string") {
    indexs = [drop, ...indexs];
    drop = false;
  }
  const map: {[index: string]: boolean} = {};
  indexs.forEach((index) => {map[index] = true; });
  return function SelectPairOperation(source: Observable<Pair>): Observable<Pair> {
    return source.pipe(filter(
      (p: Pair) => !map[p[0]] === drop,
    ));
  };
}
