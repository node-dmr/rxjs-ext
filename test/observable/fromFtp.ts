/*
 * @Author: qiansc
 * @Date: 2018-11-05 22:15:47
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-07 17:51:15
 */
import {expect} from "chai";
import {FtpSrv} from "ftp-srv";
import {fromFtp} from "../../src";
import log from "../extention/log";

describe("SourceFtp Test", () => {
  let server;
  before(() => {
    server = new FtpSrv({
      anonymous: true,
      greeting: ["Welcome", "to", "the", "jungle!"],
      url: "ftp://127.0.0.1:8880",
    });
    server.on("login", ({username, password}, resolve, reject) => {
      if (username === "test" && password === "test" || username === "anonymous") {
        resolve({root: __dirname});
      } else {
        reject("Bad username or password");
      }
    });
    server.listen();
  });

  it("Ftp Download", () => {
    const source = fromFtp({
      host: "127.0.0.1",
      path: "/ftp-test.dict",
      port: 8880,
    });
    let content = "";
    return new Promise((resolve, reject) => {
      source.subscribe(
        (chunk) => {content += chunk.toString(); },
        (err) => {reject(err); },
        () => {
          log("Get Content => ", content);
          expect(content).to.be.eq("success-ftp");
          resolve();
        },
      );
    });
  });

  it("Ftp Download Error Test", () => {
    const source = fromFtp({
      host: "127.0.0.1",
      path: "/err",
      port: 8880,
    });
    return new Promise((resolve, reject) => {
      source.subscribe(
        undefined,
        (err) => {
          console.log("Error has been caught: ", err);
          resolve();
        },
        () => {
          reject();
        },
      );
    });
  });

  after(() => {
    server.close();
  });
});
