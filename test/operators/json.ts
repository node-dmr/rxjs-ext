import {expect} from "chai";
import {ConnectableObservable, defer, of, throwError} from "rxjs";
import {map, pluck, publish} from "rxjs/operators";
import {json, jsonLazy} from "../../src";
import log from "../extention/log";

describe("Json Test", () => {
  it("Json: Not Lazy", () => {
    const txt = "{A: \'a\',\"B\":1,\"C\":\"20180909\", \"D\": {E: 1}}";
    let count = 0;
    of(txt).pipe(json<{
      A: string,
      B: number,
      C: string,
      D: {E: number},
    }>()).subscribe(
      (result) => {
        log(result);
        expect(result.A).to.be.eq("a");
        expect(result.B).to.be.eq(1);
        expect(result.C).to.be.eq("20180909");
        expect(result.D.E).to.be.eq(1);
        count++;
      },
      (err) => {throw new Error("Never should be here!"); },
      () => {
        expect(count).to.be.eq(1);
        log("complete");
      },
    );
  });

  it("Json: Lazy", () => {
    const txt = "{A: \'a\',\"B\":1,\"C\":\"20180909\", \"D\": {E: 1}}";
    let count = 0;
    of(txt).pipe(
      jsonLazy(),
      pluck("D"),
      json<{E: number}>(),
    ).subscribe(
      (result) => {
        log(result);
        expect(result.E).to.be.eq(1);
        count++;
      },
      (err) => {throw new Error("Never should be here!"); },
      () => {
        expect(count).to.be.eq(1);
        log("complete");
      },
    );
  });

  it("Error Caught", () => {
    throwError("123").pipe(
      json(),
    ).subscribe(
      (arr) => {throw new Error("Never should be here!"); },
      (err) => {log(err); },
      () => {throw new Error("Never should be here!"); },
    );
  });
});
