/*
 * @Author: qiansc
 * @Date: 2018-11-07 19:37:44
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-07 19:39:21
 */
import {Observable, OperatorFunction} from "rxjs";
import {map} from "rxjs/operators";
import {fromFtp, FtpReadOption} from "../observable/fromFtp";

export function mapFtp(): OperatorFunction<FtpReadOption, Observable<Buffer>> {
  return map((option: FtpReadOption) => fromFtp(option));
}
