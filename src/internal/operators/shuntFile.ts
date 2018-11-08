/*
 * @Author: qiansc
 * @Date: 2018-11-08 09:51:10
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 11:56:02
 */
import {createWriteStream} from "fs";
import * as fse from "fs-extra";
import * as path from "path";
import {Observable, Operator, OperatorFunction, Subscriber} from "rxjs";
/**
 * shuntFile provides the operator to write the buffer to the file and returns Observable<Buffer>
 *
 * @param FileWriteOption option
 * @example
 * of("A", "B", "C").pipe(shuntFile(filePath)).subscribe(
 *  (v) => console.log(v),  // "A"  "B"  "C"
 *  undefined,
 *  () => console.log(fs.readFileSync(filePath).toString());  // "ABC"
 * );
 */
export function shuntFile<T extends (Buffer | string)>(option: string | FileWriteOption): OperatorFunction<T, T> {
  return function shuntFileOperation(source: Observable<T>): Observable<T> {
    return source.lift(new ShuntFileOperator(Object.assign({
      encoding: "utf-8",
    }, typeof option === "string" ? {
      path: option,
    } : option)));
  };
}

export class ShuntFileOperator<T extends (Buffer | string)> implements Operator<T, T> {
  constructor(private option: FileWriteOption) {}
  public call(subscriber: Subscriber<T>, source: Observable<T>): any {
      const option = this.option;
      const baseUrl = path.dirname(option.path);
      fse.ensureDirSync(baseUrl);
      const writer = createWriteStream(option.path, option);
      source.subscribe(
        (chunk) => {
          writer.write(chunk.toString());
          subscriber.next(chunk);
        },
        (err) => {
          writer.end(undefined, undefined, () => {
            subscriber.error(err);
          });
        },
        () => {
          writer.end(undefined, undefined, () => {
            subscriber.complete();
          });
        },
      );
  }
}

/**
 * The describtion of parameters are same as<br>
 * https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
 */
export interface FileWriteOption {
  path: string;
  flags?: string | undefined;
  encoding?: string | undefined;
  fd?: number | undefined;
  mode?: number | undefined;
  autoClose?: boolean | undefined;
  start?: number | undefined;
}
