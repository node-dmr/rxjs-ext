/*
 * @Author: qiansc
 * @Date: 2018-11-07 22:39:10
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-07 23:04:19
 */
import {expect} from "chai";
import * as fse from "fs-extra";
import * as path from "path";
import {of} from "rxjs";
import { concatAll } from "rxjs/operators";
import {mapFile} from "../../src";
import log from "../extention/log";

const TEST_JSON = {status: "200"};

describe("FromFile Test", () => {
  let file: string;
  before(() => {
    file = path.resolve(__dirname, "./tmp0.log");
    fse.removeSync(file);
    fse.writeJsonSync(file, TEST_JSON);
  });

  it("Read File: path", () => {
    let rs = "";
    return new Promise((resolve, reject) => {
      of(file).pipe(
        mapFile(),
        concatAll(),
      ).subscribe(
        (chunk) => {rs += chunk.toString(); },
        (err) => reject(),
        () => {
          expect(JSON.parse(rs).status).to.be.eq("200");
          resolve();
        },
      );
    });
  });

  it("Error Test", () => {
    return new Promise((resolve, reject) => {
      of(file + "xxx").pipe(
        mapFile(),
        concatAll(),
      ).subscribe(
        undefined,
        (err) => {
          log("Error Caught: ", err),
          resolve();
        },
        () => reject(),
      );
    });
  });

  after(() => {
    fse.removeSync(path.resolve(file));
  });
});
