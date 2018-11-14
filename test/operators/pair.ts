/*
 * @Author: qiansc
 * @Date: 2018-11-09 09:39:29
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-13 15:18:05
 */
import {expect} from "chai";
import {ConnectableObservable, of, throwError, timer} from "rxjs";
import {concatAll, filter, map, mapTo, publish, take} from "rxjs/operators";
import {pair, split, splitAll} from "../../src";
import log from "../extention/log";

describe("Operator Pair Test", () => {
  it("Pair Default", () => {
    const result = [[ "fs", "900" ], [ "domc", "1200" ], [ "load", "1400" ]];
    let count = 0;
    of("fs=900&domc=1200&load=1400&ext").pipe(
      splitAll("&"),
      split("="),
      pair(),
    ).subscribe(
      (p) => {
        log(p);
        expect(p.join(",")).to.be.eq(result[count++].join(","));
      },
    );
  });

  it("Pair Expr", () => {
    const result = [[ "t_fs", "900" ], [ "t_domc", "1200" ], [ "t_load", "1400" ]];
    let count = 0;
    of("fs=900&domc=1200&load=1400&ext").pipe(
      splitAll("&"),
      split("="),
      pair("`t_${$0}`", "`${$1}`"),
    ).subscribe(
      (p) => {
        log(p);
        expect(p.join(",")).to.be.eq(result[count++].join(","));
      },
    );
  });

  it("Pair Mixed", () => {
    const result = [[ "t_fs", "900" ], [ "t_domc", "1200" ], [ "t_load", "1400" ]];
    let count = 0;
    of("fs=900&domc=1200&load=1400&ext").pipe(
      splitAll("&"),
      split("="),
      pair("`t_${$0}`", 1),
    ).subscribe(
      (p) => {
        log(p);
        expect(p.join(",")).to.be.eq(result[count++].join(","));
      },
    );
  });

  it("Pair value out of index", () => {
    const result = [[ "fs", "undefined" ], [ "domc", "undefined" ], [ "load", "undefined" ]];
    let count = 0;
    of("fs=900&domc=1200&load=1400&ext").pipe(
      splitAll("&"),
      split("="),
      pair(0, 10),
    ).subscribe(
      (p) => {
        log(p);
        expect(p.join(",")).to.be.eq(result[count++].join(","));
      },
      undefined,
      () => {expect(count).to.be.eq(3); },
    );
  });

  it("Pair key out of index", () => {
    let count = 0;
    of("fs=900&domc=1200&load=1400&ext").pipe(
      splitAll("&"),
      split("="),
      pair(10, 1),
    ).subscribe(
      (p) => {count++; },
      undefined,
      () => {expect(count).to.be.eq(0); },
    );
  });

  it("Pair String Input", () => {
    const result = [[ "domc", "800" ], [ "domc", "900" ]];
    let count = 0;
    of("800", "900").pipe(
      pair("domc", 0),
    ).subscribe(
      (p) => {
        log(p);
        expect(p.join(",")).to.be.eq(result[count++].join(","));
      },
    );
  });

});

describe("Operator Pair Error Caught", () => {

  it("Error Caught", () => {
    throwError("Err Info1").pipe(
      pair(),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });

  it("Error Caught", () => {
    throwError("Err Info2").pipe(
      pair("`t_${$0}`", "`${$1}`"),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
