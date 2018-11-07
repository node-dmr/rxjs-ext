/*
 * @Author: qiansc
 * @Date: 2018-11-05 20:08:22
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-07 17:50:52
 */
import * as Client from "ftp";
import {Observable} from "rxjs";

export function fromFtp(option: FtpReadOption) {
  return new Observable<Buffer>((subscriber) => {
    const client = new Client();
    client.on("ready", () => {
      client.get(option.path as string, (err, stream) => {
        if (err) {
          subscriber.error(err);
        } else {
          stream.on("data", (chunk) => {subscriber.next(chunk); });
          stream.on("close", () => {
            client.end();
            subscriber.complete();
          });
        }
      });
    });
    console.log(option);
    client.connect(option);
  });
}

/**
 * The describtion of parameters are same as<br>
 * https://www.npmjs.com/package/ftp
 */
export interface FtpReadOption extends Client.Options {
  path?: string;
}
