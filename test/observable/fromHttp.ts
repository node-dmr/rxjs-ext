/*
 * @Author: qiansc
 * @Date: 2018-11-05 22:15:47
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-06 10:32:07
 */
import {expect} from "chai";
import {concatAll} from "rxjs/operators";
import {fromHttp} from "../../src";
import log from "../extention/log";
import * as TestServer from "../extention/test-server";

const TestConfig = {port: 8099 , content: "hello dmr\nsuccess"};

describe("Operator fromHttp Test", () => {
  before(() => {
    log("TestServer Start");
    TestServer.start(TestConfig);
  });

  it("Get Content", () => {
    return new Promise((resolve, reject) => {
      let result = "";
      const source = fromHttp({
        host: "localhost",
        path: "/",
        port: "8099",
        timeout: 500,
      });
      source.subscribe(
        (chunk) => {result += chunk.toString(); },
        (err) => {
          console.warn(err);
          reject();
        },
        () => {
          log(result);
          expect(result).to.be.eq(TestConfig.content);
          resolve();
        },
      );
    });
  });

  it("Request Error Test", () => {
    return new Promise((resolve, reject) => {
      const source = fromHttp("http://localhost:8111/error", {
        encoding: "utf-8",
      });
      source.subscribe(
        undefined,
        (err) => {
          log("Error Caught : ", err);
          resolve();
        },
        () => reject(),
      );
    });
  });

  it("Request Timeout Test", () => {
    return new Promise((resolve, reject) => {
      const source = fromHttp({
        host: "localhost",
        path: "/HOLD",
        port: "8099",
        timeout: 500,
      });
      source.subscribe(
        undefined,
        (err) => {
          log("Error Caught : ", err);
          resolve();
        },
        () => reject(),
      );
    });
  });

  it("Response Timeout Test", () => {
    return new Promise((resolve, reject) => {
      const source = fromHttp({
        host: "localhost",
        path: "/WAIT",
        port: "8099",
        timeout: 1200,
      });
      source.subscribe(
        (chunk) => {log(chunk); },
        (err) => {
          log("Error Caught : ", err);
          resolve();
        },
        () => reject(),
      );
    });
  });

  after(() => {
    TestServer.stop();
  });
});
