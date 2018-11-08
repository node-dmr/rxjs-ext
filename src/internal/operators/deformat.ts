/*
 * @Author: qiansc
 * @Date: 2018-11-08 13:50:04
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 16:43:07
 */
import * as Deformat from "deformat";
import {Observable, Operator, OperatorFunction, Subscriber} from "rxjs";
/**
 * Deformat provides the operator to split value and returns {[index: string]: string},
 * Usually used when parsing server logs.
 *
 * @param string combined based https://www.npmjs.com/package/deformat
 * @example
 * const combined = `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"`;
 * const log = `192.168.203.111 - - [03/Dec/2014:22:07:37 -0800] "GET /api/foo/bar?key=value&key=has space&key has \x22&key2=var2 HTTP/1.1" 404 576 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"`;
 *
 * of(log).pipe(deformat(combined))
 *  .subscribe((v) => console.log);
 * // {remote_addr: "192.168.203.111", remote_user: ...}
 */
export function deformat(combined: string): OperatorFunction<string, {[index: string]: string}> {
  return function optionOperation(source: Observable<string>): Observable<{[index: string]: string}> {
    return source.lift(new DeformatOperator(combined));
  };
}

export class DeformatOperator implements Operator<string, {[index: string]: string}> {
  private handdler: any;
  constructor(combined: string) {
    this.handdler = Deformat(combined);
  }
  public call(subscriber: Subscriber<{[index: string]: string}>, source: Observable<string>): any {
    console.log("link");
    source.subscribe(
      (origin) => {
        const rs: {[index: string]: string} = this.handdler.exec(origin);
        console.log("exec");
        if (rs !== null) {subscriber.next(rs); }
      },
      (err) => {subscriber.error(err); },
      () => {subscriber.complete(); },
    );
  }
}
