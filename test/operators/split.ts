/*
 * @Author: qiansc
 * @Date: 2018-11-08 18:36:04
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 19:13:44
 */
import {expect} from "chai";
import {ConnectableObservable, defer, of, throwError} from "rxjs";
import {map, publish} from "rxjs/operators";
import {split, splitKeep} from "../../src";
import log from "../extention/log";

describe("Split Test", () => {
  it("Split Without Keep", () => {
    of("1,2,3", "P").pipe(
      split(","),
    ).subscribe(
      (arr) => {
        expect(arr.join("|")).to.be.eq("1|2|3");
      },
      undefined,
      () => console.log("complete"),
    );
  });

  it("Split With Keep", () => {
    const rs: string[][] = [];
    of("1,2,3", "P").pipe(
      splitKeep(","),
    ).subscribe(
      (arr) => {
        rs.push(arr);
      },
      (err) => {throw new Error("Never should be here!"); },
      () => console.log("complete", rs),
    );
    expect(rs[0].join("|")).to.be.eq("1|2|3");
    expect(rs[1][0]).to.be.eq("P");
  });

  it("Error Caught", () => {
    const rs: string[][] = [];
    throwError("123").pipe(
      splitKeep(","),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
