/*
 * @Author: qiansc
 * @Date: 2018-11-05 14:38:00
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-05 20:40:09
 */
import {ClientRequestArgs} from "http";
import {Observable, OperatorFunction} from "rxjs";
import {map} from "rxjs/operators";
import {fromHttp} from "../observable/fromHttp";

export function mapHttp<T extends (string | ClientRequestArgs)>(): OperatorFunction<T, Observable<Buffer>> {
  return map((option: T) => fromHttp(option));
}
