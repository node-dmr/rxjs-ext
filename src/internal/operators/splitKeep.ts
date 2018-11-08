/*
 * @Author: qiansc
 * @Date: 2018-11-08 18:56:58
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 19:03:08
 */
import {split} from "./split";

export function splitKeep(separater: string) {
  return split(separater, true);
}
