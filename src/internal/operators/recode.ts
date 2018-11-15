/*
 * @Author: qiansc
 * @Date: 2018-11-15 23:31:25
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-15 23:39:13
 */
import {Observable, OperatorFunction} from "rxjs";
import { map } from "rxjs/operators";

const func = {
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
};

export function recode(type: RecodeTypes): OperatorFunction<string, string> {
  return function RecodeOperation(source: Observable<string>): Observable<string> {
    return source.pipe(map((str) => func[type](str)));
  };
}
export type RecodeTypes  = "encodeURIComponent" | "encodeURI" | "decodeURIComponent" | "decodeURI";
