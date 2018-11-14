/*
 * @Author: qiansc ]
 * @Date: 2018-11-14 23:25:53
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-14 23:55:02
 */

import {expect} from "chai";
import {of, throwError} from "rxjs";
import {filterPair} from "../../src";
import log from "../extention/log";

describe("FilterPair Test", () => {
  it("String", () => {
    let count = 0;
    of(["load", "980"], ["domc", "1200"]).pipe(
      filterPair("true"),
    ).subscribe((pair) => {count++; log(pair); });
    expect(count).to.be.eq(2);

    log("count", count);

    of(["load", "980"], ["domc", "1200"]).pipe(
      filterPair("??"),
    ).subscribe((pair) => {count++; log(pair); });
    expect(count).to.be.eq(2);
  });

  it("ExprLike", () => {
    let count = 0;
    of(["load", "980"], ["domc", "1200"]).pipe(
      filterPair("`${index === 'load'}`"),
    ).subscribe((pair) => {
      count++; log(pair);
      expect(pair[0]).to.be.eq("load");
      expect(pair[1]).to.be.eq("980");
    });
    expect(count).to.be.eq(1);

    log("count", count);

    of(["load", "980"], ["domc", "1200"]).pipe(
      filterPair("`${value > 1000}`"),
    ).subscribe((pair) => {
      count++; log(pair);
      expect(pair[0]).to.be.eq("domc");
      expect(pair[1]).to.be.eq("1200");
    });
    expect(count).to.be.eq(2);
  });

});

describe("Operator FilterPair Error Caught", () => {
  it("Error Caught", () => {
    throwError("Err Info").pipe(
      filterPair("err"),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
