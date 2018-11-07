/*
 * @Author: qiansc
 * @Date: 2018-11-07 22:39:10
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-07 22:53:54
 */
import {expect} from "chai";
import * as fse from "fs-extra";
import * as path from "path";
import {fromFile} from "../../src";
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
      fromFile(file).subscribe(
        (chunk) => {rs += chunk.toString(); },
        (err) => reject(),
        () => {
          expect(JSON.parse(rs).status).to.be.eq("200");
          resolve();
        },
      );
    });
  });

  it("Read File: option", () => {
    let rs = "";
    return new Promise((resolve, reject) => {
      fromFile({
        encoding: "utf-8",
        path: file,
      }).subscribe(
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
      fromFile(file + "xxx").subscribe(
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
