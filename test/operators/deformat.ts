/*
 * @Author: qiansc
 * @Date: 2018-11-08 14:30:05
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 16:55:15
 */
import {expect} from "chai";
import {ConnectableObservable, defer, of, throwError} from "rxjs";
import {map, publish} from "rxjs/operators";
import {deformat} from "../../src";
import log from "../extention/log";

describe("Deformat Test", () => {
  it("Log parse", () => {
    const combined = `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"`;
    const onelog = `192.168.203.111 - - [03/Dec/2014:22:07:37 -0800] "GET /api/foo/bar?key=value&key=has space&key has \x22&key2=var2 HTTP/1.1" 404 576 "-" "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"`;
    of(onelog).pipe(
      deformat(combined),
      )
    .subscribe(
      (v) => {
        log(v);
        expect(v.remote_addr).to.be.eq("192.168.203.111");
        expect(v.remote_user).to.be.eq("-");
        expect(v.time_local).to.be.eq("03/Dec/2014:22:07:37 -0800");
      },
      (err) => {throw new Error("Never should be here!"); },
      () => {
        log("complete");
      },
    );
  });

  it("Null parse", () => {
    const combined = `$A - $B`;
    const onelog = `CCCCDDDD`;
    of(onelog).pipe(deformat(combined))
    .subscribe(
      (v) => {throw new Error("Never should be here!"); },
      (err) => {throw new Error("Never should be here!"); },
      () => {
        log("complete");
      },
    );
  });

  const result: string[] = [];
  let deformatTimes = 0;
  it("Twice subscriber , once deformat", () => {
    const combined = `$A-$B`;
    const onelog = `1-2`;
    const source = of(onelog).pipe(deformat(combined), map((v) => { deformatTimes++ ; return v; }), publish());
    source.subscribe(
      (v) => {console.log(v); result.push(v.A); },
      (err) => {throw new Error("Never should be here!"); },
      () => {
        log("complete");
      },
    );
    source.subscribe(
      (v) => {console.log(v); result.push(v.A); },
      (err) => {throw new Error("Never should be here!"); },
      () => {
        log("complete");
      },
    );
    (source as ConnectableObservable<any>).connect();
  });

  after(() => {
    console.log("deformatTimes", deformatTimes);
    expect(deformatTimes).to.be.eq(1);
    console.log(result);
    expect(result.join("")).to.be.eq("11");
  });

});

describe("Deformat Error Test", () => {
  it("Error Throw", () => {
    throwError("err").pipe(deformat("$A-$B")).subscribe(
      (v) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
