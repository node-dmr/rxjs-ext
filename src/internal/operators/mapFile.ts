/*
 * @Author: qiansc
 * @Date: 2018-11-07 19:37:44
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-07 23:03:45
 */
import {Observable, OperatorFunction} from "rxjs";
import {map} from "rxjs/operators";
import {FileReadOption, fromFile} from "../observable/fromFile";

export function mapFile(): OperatorFunction<string | FileReadOption, Observable<Buffer>> {
  return map((option: string | FileReadOption) => fromFile(option));
}
