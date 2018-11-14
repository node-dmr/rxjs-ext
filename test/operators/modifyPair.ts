/*
 * @Author: qiansc ]
 * @Date: 2018-11-14 23:25:53
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-14 23:46:52
 */

import {expect} from "chai";
import {of, throwError} from "rxjs";
import {modifyPair} from "../../src";
import log from "../extention/log";

describe("ModifyPair Test", () => {
  it("ExprLike", () => {
    let count = 0;
    of(["load", "980000"]).pipe(
      modifyPair("`${index}_ms`", "`${value / 1000}`"),
    ).subscribe(
      (pair) => {
        count++;
        log(pair);
        expect(pair[0]).to.be.eq("load_ms");
        expect(pair[1]).to.be.eq("980");
      },
    );
    expect(count).to.be.eq(1);
  });

  it("ExprLike Undefined & String", () => {
    let count = 0;
    of(["load", "980000"]).pipe(
      modifyPair(undefined, "1000"),
    ).subscribe(
      (pair) => {
        count++;
        log(pair);
        expect(pair[0]).to.be.eq("load");
        expect(pair[1]).to.be.eq("1000");
      },
    );
    expect(count).to.be.eq(1);
  });

  it("ExprLike Expr & Undefined", () => {
    let count = 0;
    of(["load", "980000"]).pipe(
      modifyPair("`time_${index}`"),
    ).subscribe(
      (pair) => {
        count++;
        log(pair);
        expect(pair[0]).to.be.eq("time_load");
        expect(pair[1]).to.be.eq("980000");
      },
    );
    expect(count).to.be.eq(1);
  });

});

describe("Operator ModifyPair Error Caught", () => {
  it("Error Caught", () => {
    throwError("Err Info").pipe(
      modifyPair("err"),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
