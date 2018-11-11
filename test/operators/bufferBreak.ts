/*
 * @Author: qiansc
 * @Date: 2018-11-11 10:42:05
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-11 16:36:26
 */
import {expect} from "chai";
import fs = require("fs");
import path = require("path");
import {throwError} from "rxjs";
import {bufferBreak, fromFile} from "../../src";
import log from "../extention/log";

describe("bufferBreak Operator Test", () =>  {
  it("read 5 lines form lines-5.log", () => {
    const source = fromFile(path.resolve(__dirname, "../assets/line-5.txt"));
    return new Promise((resolve) => {
      const lines: string[] = [];
      source.pipe(bufferBreak()).subscribe(
        (eachLine) => {lines.push(eachLine.toString()); },
        undefined,
        () => {
          log(lines);
          expect(lines.length).to.be.eq(5);
          expect(lines[0]).to.be.eq("1");
          expect(lines[4]).to.be.eq("5");
          resolve();
        },
      );
    });
  });

  it("read complex lines by highWaterMark 4 => 9", () => {
    const source = fromFile({
      highWaterMark: 4,
      path: path.resolve(__dirname, "../assets/line-complex.txt"),
    });
    const lines: string[] = [];

    return new Promise((resolve) => {
      source.pipe(bufferBreak("\n")).subscribe(
        (chunk) => lines.push(chunk.toString()),
        undefined,
        () => {
          log(lines);
          expect(lines.length).to.be.eq(9);
          expect(lines[1]).to.be.eq("123456789");
          expect(lines[5]).to.be.eq("12334");
          expect(lines[8]).to.be.eq("88");
          resolve();
        },
      );
    });
  });

  it("Error Caught", () => {
    const rs: string[][] = [];
    throwError("123").pipe(
      bufferBreak(),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
