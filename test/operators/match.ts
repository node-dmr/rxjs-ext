/*
 * @Author: qiansc
 * @Date: 2018-11-08 18:36:04
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-11 17:15:27
 */
import {expect} from "chai";
import {ConnectableObservable, defer, of, throwError} from "rxjs";
import {map, publish} from "rxjs/operators";
import {match} from "../../src";
import log from "../extention/log";

describe("Regexp Test", () => {
  it("Regexp: regexp option", () => {
    let count = 0;
    of("key=value").pipe(
      match(/(\w+)=(\w+)/),
    ).subscribe(
      (arr) => {
        log(arr);
        count++;
        expect(arr[1]).to.be.eq("key");
        expect(arr[2]).to.be.eq("value");
      },
      undefined,
      () => {
        expect(count).to.be.eq(1);
      },
    );
  });

  it("Regexp: not match", () => {
    let count = 0;
    of("key+value").pipe(
      match("(\\w+)=(\\w+)"),
    ).subscribe(
      (arr) => {
        log(arr);
        count++;
      },
      undefined,
      () => {
        expect(count).to.be.eq(0);
      },
    );
  });

  it("Regexp: flags", () => {
    const rs: string[][] = [];
    of("load=999&domc=888").pipe(
      match("(\\w+)=(\\w+)", "g"),
    ).subscribe(
      (arr) => {
        log(arr);
        rs.push(arr);
      },
      undefined,
      () => {
        expect(rs.length).to.be.eq(1);
        expect(rs[0][0]).to.be.eq("load=999");
        expect(rs[0][1]).to.be.eq("domc=888");
      },
    );
  });

  it("Error Caught", () => {
    const rs: string[][] = [];
    throwError("123").pipe(
      match(/key/),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
