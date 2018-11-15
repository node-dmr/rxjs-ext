/*
 * @Author: qiansc ]
 * @Date: 2018-11-14 23:25:53
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-15 17:29:28
 */

import {expect} from "chai";
import {of, throwError} from "rxjs";
import { map } from "rxjs/operators";
import {modify, modifyPairWith} from "../../src";
import log from "../extention/log";

describe("ModifyPairWith Test", () => {
  it("With Modify", () => {
    let count = 0;
    of(["load", "980000"]).pipe(
      modifyPairWith(modify("`${value}_ms`"), modify("`${value / 1000}`")),
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
      modifyPairWith(undefined, modify("1000")),
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
      modifyPairWith(modify("`time_${value}`")),
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

describe("Operator ModifyPairWith Error Caught", () => {
  it("Error Caught", () => {
    throwError("Err Info").pipe(
      modifyPairWith(),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });

  it("Error Caught in Index", () => {
    of(["key", "value"]).pipe(
      modifyPairWith(
        map((v) => {
          throw new Error("Err Index");
          return v;
        }),
      ),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });

  it("Error Caught in Value", () => {
    of(["key", "value"]).pipe(
      modifyPairWith(
        undefined,
        map((v) => {
          throw new Error("Err Value");
          return v;
        }),
      ),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });

});
