/*
 * @Author: qiansc
 * @Date: 2018-11-11 16:35:23
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-11 17:06:15
 */
import {expect} from "chai";
import fs = require("fs");
import path = require("path");
import {asyncScheduler, from, throwError} from "rxjs";
import {fromFile, line} from "../../src";
import log from "../extention/log";

describe("Line Operator Test", () =>  {
  it("string[] test", () => {
    const arr = ["1111111111\n22", "222222\n3333\n4", "444\n5"];
    const result = arr.join("").split("\n");
    let cursor = 0;
    return new Promise((resolve) => {
      from(arr, asyncScheduler).pipe(line()).subscribe(
        (item) => {
          log(item);
          expect(result[cursor]).to.be.eq(item);
          cursor++;
        },
        undefined,
        () => resolve(),
      );
    });
  });

  it("buffer[] test", () => {
    const source = fromFile(path.resolve(__dirname, "../assets/line-5.txt"));
    return new Promise((resolve) => {
      const lines: string[] = [];
      source.pipe(line()).subscribe(
        (eachLine) => {lines.push(eachLine); },
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
});
