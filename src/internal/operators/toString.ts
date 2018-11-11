/*
 * @Author: qiansc
 * @Date: 2018-11-09 13:52:56
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-09 13:58:08
 */
import {map} from "rxjs/operators";
export function toString() {
  return map((chunk) => chunk.toString());
}
