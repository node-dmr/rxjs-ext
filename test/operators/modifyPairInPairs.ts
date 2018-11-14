/*
 * @Author: qiansc ]
 * @Date: 2018-11-14 23:25:53
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-15 00:38:36
 */

import {expect} from "chai";
import {of, throwError} from "rxjs";
import {modifyPairInPairs, Pair} from "../../src";
import log from "../extention/log";

describe("ModifyPairInPairs Test", () => {
  it("string string", () => {
    let count = 0;
    const result = [["load", "980"], ["domc", "1200"], ["net", "560"]];
    of([["load", "980000"], ["domc", "1200"], ["net", "560"]]).pipe(
      modifyPairInPairs("load", "980"),
    ).subscribe(
      (pairs) => {
        log(pairs);
        expect(result.join(",")).to.be.eq(pairs.join(","));
        count++;
      },
    );
    expect(count).to.be.eq(1);
  });

  it("RegExp ExprLike", () => {
    let count = 0;
    const result = [["load", "980000"], ["domc", "1.2s"], ["net", "0.56s"]];
    of([["load", "980000"], ["domc", "1200"], ["net", "560"]]).pipe(
      modifyPairInPairs(/(domc|net)/, "`${value / 1000}s`"),
    ).subscribe(
      (pairs) => {
        log(pairs);
        count++;
        expect(result.join(",")).to.be.eq(pairs.join(","));
      },
    );
    expect(count).to.be.eq(1);
  });

  it("RegExp ExprLike ExprLike", () => {
    let count = 0;
    const result = [["ts_load", "980"], ["domc", "1200"], ["net", "560"]];
    of([["load", "980000"], ["domc", "1200"], ["net", "560"]]).pipe(
      modifyPairInPairs(/(load)/, "`${value / 1000}`", "`ts_${index}`"),
    ).subscribe(
      (pairs) => {
        log(pairs);
        count++;
        expect(result.join(",")).to.be.eq(pairs.join(","));
      },
    );
    expect(count).to.be.eq(1);
  });

  it("Mixed Add", () => {
    let count = 0;
    const result = [["load", "980"], ["domc", "1200"], ["net", "560"], ["front", 640]];
    of([["load", "980000"], ["domc", "1200"], ["net", "560"]]).pipe(
      modifyPairInPairs("load", "`${value / 1000}`"),
      modifyPairInPairs("domc", "`${$domc - $net}`", "front", "add"),
    ).subscribe(
      (pairs) => {
        log(pairs);
        count++;
        expect(result.join(",")).to.be.eq(pairs.join(","));
      },
    );
    expect(count).to.be.eq(1);
  });

  it("Mixed Adds", () => {
    let count = 0;
    const result = [["paint", "300"], ["dom", "200"], ["net", "560"], ["paintAll", "860"], ["domAll", "760"]];
    of([["paint", "300"], ["dom", "200"], ["net", "560"]]).pipe(
      modifyPairInPairs(/(paint|dom)/, "`${value * 1 + $net * 1}`", "`${index}All`", "add"),
    ).subscribe(
      (pairs) => {
        log(pairs);
        count++;
        expect(result.join(",")).to.be.eq(pairs.join(","));
      },
    );
    expect(count).to.be.eq(1);
  });

});

describe("Operator ModifyPairInPairs Error Caught", () => {
  it("Error Caught", () => {
    throwError("Err Info").pipe(
      modifyPairInPairs("err", "ss"),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
