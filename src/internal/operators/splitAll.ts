/*
 * @Author: qiansc
 * @Date: 2018-11-13 13:07:41
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-13 13:26:27
 */
import {Observable, OperatorFunction} from "rxjs";
import { concatAll } from "rxjs/operators";
import {split} from "./split";

export function splitAll(separater: string, keep: boolean = false): OperatorFunction<string, string> {
  return function SplitAllOperation(source: Observable<string>): Observable<string> {
    return source.pipe(split(separater, keep), concatAll());
  };
}
