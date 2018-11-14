/*
 * @Author: qiansc ]
 * @Date: 2018-11-14 23:25:53
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-14 23:44:45
 */

import {expect} from "chai";
import {of, throwError} from "rxjs";
import {modify} from "../../src";
import log from "../extention/log";

describe("Modify Test", () => {
  it("ExprLike hello world", () => {
    of("hello").pipe(
      modify("`${value} world`"),
    ).subscribe(
      (str) => {
        log(str);
        expect(str).to.be.eq("hello world");
      },
    );
  });

  it("ExprLike string", () => {
    of("hello").pipe(
      modify("world"),
    ).subscribe(
      (str) => {
        log(str);
        expect(str).to.be.eq("world");
      },
    );
  });

  it("ExprLike string", () => {
    of("123").pipe(
      modify("`${value * 2}`"),
    ).subscribe(
      (str) => {
        log(str);
        expect(str).to.be.eq("246");
      },
    );
  });
});

describe("Operator Modify Error Caught", () => {
  it("Error Caught", () => {
    throwError("Err Info").pipe(
      modify("err"),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
