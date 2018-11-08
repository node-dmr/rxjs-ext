/*
 * @Author: qiansc
 * @Date: 2018-11-07 19:40:06
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-08 12:15:04
 */
import {expect} from "chai";
import {FtpSrv} from "ftp-srv";
import * as path from "path";
import {of} from "rxjs";
import {concatAll} from "rxjs/operators";
import {mapFtp, option} from "../../src";
import log from "../extention/log";

describe("mapFtp Test", () => {
  let server;
  before(() => {
    server = new FtpSrv("ftp://127.0.0.1:8880", {
      anonymous: true,
      greeting: ["Welcome", "to", "the", "jungle!"],
    });
    // FtpSrv 3.0.1 types is error , wait to upgrade
    // server = new FtpSrv({
    //   anonymous: true,
    //   greeting: ["Welcome", "to", "the", "jungle!"],
    //   url: "ftp://127.0.0.1:8880",
    // });
    server.on("login", ({username, password}, resolve, reject) => {
      if (username === "test" && password === "test" || username === "anonymous") {
        resolve({root: path.resolve(__dirname, "../extention/")});
      } else {
        reject("Bad username or password");
      }
    });
    server.listen();
  });

  it("Ftp Download", () => {
    const source = of({}).pipe(
      option({
        host: "127.0.0.1",
        path: "/ftp-test.dict",
        port: 8880,
      }),
      mapFtp(),
      concatAll(),
    );
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

  after(() => {
    server.close();
  });
});
