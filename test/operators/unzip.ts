/*
 * @Author: qiansc
 * @Date: 2018-11-13 12:47:06
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-13 13:59:00
 */
import {expect} from "chai";
import {ConnectableObservable, of, throwError, timer} from "rxjs";
import {concatAll, filter, map, mapTo, publish, take} from "rxjs/operators";
import {unzip} from "../../src";
import log from "../extention/log";

describe("Operator Unzip Test", () => {
  it("Array Unzip", () => {
    const result = [[ "0", "A" ], [ "1", "B" ], [ "2", "C" ], [ "0", "D" ], [ "1", "E" ]];
    let count = 0;
    of(["A", "B", "C"], ["D", "E"]).pipe(
      unzip(),
    ).subscribe(
      (v) => {
        log(v);
        expect(v.join(",")).to.be.eq(result[count].join(","));
        count ++;
      },
    );
  });

  it("Object Unzip", () => {
    const result = [[ "A", "A" ], [ "B", "B" ], [ "C", "C" ], [ "D", "D" ], [ "E", "[object Object]" ]];
    let count = 0;
    of({A: "A", B: "B", C: "C"}, {D: "D", E: {}}).pipe(
      unzip(),
    ).subscribe(
      (v) => {
        log(v);
        expect(v.join(",")).to.be.eq(result[count].join(","));
        count ++;
      },
    );
  });
});

describe("Operator Unzip Error Caught", () => {
  it("Error Caught", () => {
    throwError("Err Info").pipe(
      unzip(),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
