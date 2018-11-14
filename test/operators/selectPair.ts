/*
 * @Author: qiansc
 * @Date: 2018-11-14 11:43:15
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-14 17:48:50
 */
import {expect} from "chai";
import {ConnectableObservable, defer, of, throwError} from "rxjs";
import {map, publish} from "rxjs/operators";
import {selectPair} from "../../src";
import log from "../extention/log";

describe("FilterPair Test", () => {
  it("Select Index", () => {
    let count = 0;
    of(["a", "A"], ["b", "B"]).pipe(
      selectPair("a"),
    ).subscribe(
      (pair) => {
        expect(pair[0]).to.be.eq("a");
        expect(pair[1]).to.be.eq("A");
        count ++;
      },
    );
    expect(count).to.be.eq(1);
  });

  it("Select Indexs", () => {
    let count = 0;
    of(["a", "A"], ["b", "B"], ["b", "S"], ["d", "f"]).pipe(
      selectPair("a", "b"),
    ).subscribe(
      (pair) => {
        count ++;
      },
    );
    expect(count).to.be.eq(3);
  });

  it("Drop Indexs", () => {
    let count = 0;
    of(["a", "A"], ["b", "B"], ["b", "S"], ["d", "f"]).pipe(
      selectPair(true, "a", "b"),
    ).subscribe(
      (pair) => {
        count ++;
      },
    );
    expect(count).to.be.eq(1);
  });
});
