/*
 * @Author: qiansc
 * @Date: 2018-11-08 18:04:29
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-13 14:29:22
 */
import {Observable, OperatorFunction} from "rxjs";
import { concatAll } from "rxjs/operators";
import { match } from "./match";

export function matchAll(patternOrRegExp: string | RegExp, flag?: string): OperatorFunction<string, string> {
  return function MatchAllOperation(source: Observable<string>): Observable<string> {
    return source.pipe(match(patternOrRegExp, flag), concatAll());
  };
}
