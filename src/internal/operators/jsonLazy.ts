/*
 * @Author: qiansc
 * @Date: 2018-11-08 20:52:09
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 20:53:20
 */
import {Observable, OperatorFunction} from "rxjs";
import {json} from "./json";
export function jsonLazy<T>(): OperatorFunction<string, {[index: string]: string}> {
  return json<{[index: string]: string}>(true);
}
