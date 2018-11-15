/*
 * @Author: qiansc
 * @Date: 2018-11-15 11:42:09
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-15 17:15:05
 */
import {expect} from "chai";
import {ConnectableObservable, of, throwError, timer} from "rxjs";
import {Pair, uniquePairs} from "../../src";
import log from "../extention/log";

describe("UniquePairs Test", () => {
  it("Cover", () => {
    const rs = [["a", "4"], ["b", "9"]];
    const result: Pair[][] = [];
    of([["a", "1"], ["b", "9"], ["a", "2"], ["a", "4"]]).pipe(
      uniquePairs(),
    ).subscribe(
      (pairs) => {
        log(pairs);
        result.push(pairs);
      },
    );
    expect(result.join(",")).to.be.eq(rs.join(","));
  });

  it("Abandon", () => {
    const rs = [["a", "1"], ["b", "9"]];
    const result: Pair[][] = [];
    of([["a", "1"], ["b", "9"], ["a", "2"], ["a", "4"]]).pipe(
      uniquePairs("abandon"),
    ).subscribe(
      (pairs) => {
        log(pairs);
        result.push(pairs);
      },
    );
    expect(result.join(",")).to.be.eq(rs.join(","));
  });

  it("Rename", () => {
    const rs = [["a", "1"], ["b", "9"], ["a_1", "2"], ["a_2", "4"]];
    const result: Pair[][] = [];
    of([["a", "1"], ["b", "9"], ["a", "2"], ["a", "4"]]).pipe(
      uniquePairs("rename"),
    ).subscribe(
      (pairs) => {
        log(pairs);
        result.push(pairs);
      },
    );
    expect(result.join(",")).to.be.eq(rs.join(","));
  });

  it("Cover Undefined", () => {
    const rs = [["a", "2"], ["b", "9"]];
    const result: Pair[][] = [];
    of([["a", "1"], ["b", "9"], ["a", "2"], ["a", ""], ["a", "undefined"], ["b", ""]]).pipe(
      uniquePairs(),
    ).subscribe(
      (pairs) => {
        log(pairs);
        result.push(pairs);
      },
    );
    expect(result.join(",")).to.be.eq(rs.join(","));
  });

});

describe("Operator UniquePairs Error Caught", () => {
  it("Error Caught", () => {
    throwError("Err Info").pipe(
      uniquePairs(),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
