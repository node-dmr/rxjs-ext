/*
 * @Author: qiansc
 * @Date: 2018-11-08 09:49:56
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 11:51:41
 */
import {expect} from "chai";
import * as fse from "fs-extra";
import * as path from "path";
import {of, throwError} from "rxjs";
import {shuntFile} from "../../src";
import log from "../extention/log";

describe("Shunt File Test", () => {
  const file = path.resolve(__dirname, "./test.log");
  const file1 = path.resolve(__dirname, "./test1.log");
  before(() => {
    fse.removeSync(file);
    fse.removeSync(file1);
  });

  it("Write File", () => {
    return new Promise((resolve, reject) => {
      const rs: string[] = [];
      of("1", "2", "3").pipe(
        shuntFile({
          path: file,
        }),
      ).subscribe(
        (chunk) => {rs.push(chunk.toString()); },
        (err) => {log(err); reject(); },
        () => {
          log(rs);
          expect(rs.join("")).to.be.eq("123");
          log("Pipe successfully!");
          const data = fse.readFileSync(file, {encoding: "utf-8"});
          expect(data).to.be.eq("123");
          log("Write successfully!");
          resolve();
        },
      );
    });
  });

  it("Error Test", () => {
    return new Promise((resolve, reject) => {
      throwError("error happend").pipe(
        shuntFile(file1),
      ).subscribe(
        (v) => {reject("should never get data!"); },
        (err) => {
          log(err);
          resolve();
        },
        () => {reject("should never complete!"); },
      );
    });
  });

  after(() => {
    fse.removeSync(file);
    fse.removeSync(file1);
  });
});
