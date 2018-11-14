/*
 * @Author: qiansc
 * @Date: 2018-11-14 11:49:09
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-14 12:06:29
 */
import {expect} from "chai";
import {ConnectableObservable, of, throwError, timer} from "rxjs";
import {concatAll, filter, map, mapTo, publish, take} from "rxjs/operators";
import {pairFromJson} from "../../src";
import log from "../extention/log";

describe("Operator pairFromJson Test", () => {
  it("Select Index", () => {
    const result: string[][] = [];
    of({
      a: "A",
      b: "B",
      c: 33,
    }).pipe(
      pairFromJson("a"),
    ).subscribe((v) => {log(v); result.push(v); });
    expect(result.length).to.be.eq(1);
    expect(result[0][0]).to.be.eq("a");
    expect(result[0][1]).to.be.eq("A");
  });

  it("Select Exprlike", () => {
    const result: string[][] = [];
    of({
      a: "A",
      b: "B",
      c: 33,
    }).pipe(
      pairFromJson("a", "`${a + b + c}`"),
    ).subscribe((v) => {log(v); result.push(v); });
    expect(result.length).to.be.eq(1);
    expect(result[0][0]).to.be.eq("a");
    expect(result[0][1]).to.be.eq("AB33");
  });

  it("Select Undefined", () => {
    const result: string[][] = [];
    of({
      a: "A",
      b: "B",
      c: 33,
    }).pipe(
      pairFromJson("S"),
    ).subscribe((v) => {log(v); result.push(v); });
    expect(result.length).to.be.eq(1);
    expect(result[0][0]).to.be.eq("S");
    expect(result[0][1]).to.be.eq("undefined");
  });

  it("Expr Undefined Value", () => {
    const result: string[][] = [];
    of({
      a: "A",
      b: "B",
      c: 33,
    }).pipe(
      pairFromJson("a", ""),
    ).subscribe((v) => {log(v); result.push(v); });
    expect(result.length).to.be.eq(1);
    expect(result[0][0]).to.be.eq("a");
    expect(result[0][1]).to.be.eq("undefined");
  });

  it("Expr Undefined Index", () => {
    const result: string[][] = [];
    of({
      a: "A",
      b: "B",
      c: 33,
    }).pipe(
      pairFromJson("", "S"),
    ).subscribe((v) => {log(v); result.push(v); });
    expect(result.length).to.be.eq(0);
  });

});

describe("Operator pairFromJson Error Caught", () => {
  it("Error Caught", () => {
    throwError("Err Info").pipe(
      pairFromJson("a", "b"),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
