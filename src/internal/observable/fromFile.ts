/*
 * @Author: qiansc
 * @Date: 2018-11-07 22:18:09
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 10:10:09
 */
import * as fs from "fs";
import {Observable} from "rxjs";

export function fromFile(option: string | FileReadOption) {
  return new Observable<Buffer>((subscriber) => {
    if (typeof option === "string") {
      option = {
        path: option,
      };
    }
    option.highWaterMark = option.highWaterMark || 10 * 1024;

    if (option.path && fs.existsSync(option.path)) {
      const stream = fs.createReadStream(option.path, option);
      stream.on("data", (chunk) => {subscriber.next(chunk); });
      // stream.on("error", (err) => {subscriber.error(err); });
      stream.on("close", () => {subscriber.complete(); });
    } else {
      const err = new Error("File path is not exits");
      err.stack = option.path;
      subscriber.error(err);
    }
  });
}

/**
 * The describtion of parameters are same as<br>
 * https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
 */
export interface FileReadOption {
  path?: string;
  flags?: string | undefined;
  encoding?: string | undefined;
  fd?: number | undefined;
  mode?: number | undefined;
  autoClose?: boolean | undefined;
  start?: number | undefined;
  end?: number | undefined;
  highWaterMark?: number | undefined;
}
