/*
 * @Author: qiansc
 * @Date: 2018-11-05 19:36:32
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-06 09:42:44
 */
import {expect} from "chai";
import {of} from "rxjs";
import {concatAll} from "rxjs/operators";
import {mapHttp} from "../../src";
import log from "../extention/log";
import * as TestServer from "../extention/test-server";

const TestConfig = {port: 8099 , content: "hello dmr\nsuccess"};

describe("Operator mapHttp Test", () => {
  before(() => {
    log("TestServer Start");
    TestServer.start(TestConfig);
  });
  it("Ping baidu", () => {
    const source = of("http://localhost:8099/", {
      host: "localhost",
      path: "/",
      port: "8099",
      timeout: 500,
    }).pipe(
      mapHttp(),
      concatAll(),
    );
    return new Promise((resolve, reject) => {
      const result: string[] = [];
      source.subscribe(
        (chunk) => {
          result.push(chunk.toString());
        },
        (err) => reject(),
        () => {
          log(result);
          expect(result.join("")).to.be.eq(TestConfig.content + TestConfig.content);
          resolve();
        },
      );
    });
  });
});
