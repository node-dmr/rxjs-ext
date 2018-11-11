/*
 * @Author: qiansc
 * @Date: 2018-11-11 12:12:25
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-11 12:30:57
 */
import {Observable, OperatorFunction} from "rxjs";

export function bufferBreak(breaker: string = "\n"): OperatorFunction<Buffer, Buffer> {
  return function BufferBreakOperation(source: Observable<Buffer>): Observable<Buffer> {
    let prevBuffer = new Buffer(0);
    return new Observable((observer) => {
      source.subscribe(
        (buffer) => {
          let from = 0;
          let to: number = 0;
          while ((to = buffer.indexOf(breaker, from)) >= 0) {
              let lineBuffer = buffer.slice(from, to);
              if (prevBuffer.length) {
                  // 前次chunk，存在剩余buffer进行拼接
                  lineBuffer = Buffer.concat([prevBuffer, lineBuffer], to - from + prevBuffer.length);
                  prevBuffer = new Buffer(0);
              }
              observer.next(lineBuffer);
              from = to + breaker.length;
          }
          if (from < buffer.length) {
              // 剩余buffer留用
              prevBuffer = Buffer.concat([prevBuffer, buffer.slice(from, buffer.length)],
                  buffer.length - from + prevBuffer.length);
          }
        },
        (err) => {observer.error(err); },
        () => {
          if (prevBuffer.length > 0) {
            observer.next(prevBuffer);
          }
          prevBuffer = new Buffer(0);
          observer.complete();
        },
      );
    });
  };
}
