/*
 * @Author: qiansc
 * @Date: 2018-11-14 11:43:15
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-14 11:46:58
 */
import {expect} from "chai";
import {ConnectableObservable, defer, of, throwError} from "rxjs";
import {map, publish} from "rxjs/operators";
import {filterPair} from "../../src";
import log from "../extention/log";

describe("FilterPair Test", () => {
  it("Filter 1", () => {
    let count = 0;
    of(["a", "A"], ["b", "B"]).pipe(
      filterPair("a"),
    ).subscribe(
      (pair) => {
        expect(pair[0]).to.be.eq("a");
        expect(pair[1]).to.be.eq("A");
        count ++;
      },
    );
    expect(count).to.be.eq(1);
  });

  it("Filter keys", () => {
    let count = 0;
    of(["a", "A"], ["b", "B"], ["b", "S"], ["d", "f"]).pipe(
      filterPair("a", "b"),
    ).subscribe(
      (pair) => {
        count ++;
      },
    );
    expect(count).to.be.eq(3);
  });
});
