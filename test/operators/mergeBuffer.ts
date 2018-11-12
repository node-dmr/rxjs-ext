/*
 * @Author: qiansc
 * @Date: 2018-11-12 14:41:29
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-12 16:38:51
 */
import {expect} from "chai";
import {ConnectableObservable, of, throwError, timer} from "rxjs";
import {concatAll, filter, map, mapTo, publish, take} from "rxjs/operators";
import {mergeBuffer} from "../../src";
import log from "../extention/log";

describe("mergeBuffer Test", () => {
    it("Sync", () => {
      const origin = of(1, 2, 3, 4, 5).pipe(publish()) as ConnectableObservable<number>;
      const P10 = origin.pipe(map((v) => v * 10));
      const P100 = origin.pipe(map((v) => v * 100));
      const Pdouble = origin.pipe(map((v) => of(v * 100 + 1, v * 100 + 2)), concatAll());
      const Odd = origin.pipe(filter((v) => v % 2 === 1), mapTo("Odd"));
      const results = [
        [1, 10, 100, 101, 102, "Odd"],
        [2, 20, 200, 201, 202],
        [3, 30, 300, 301, 302, "Odd"],
        [4, 40, 400, 401, 402],
        [5, 50, 500, 501, 502, "Odd"],
      ];
      of(origin , P10, P100, Pdouble, Odd).pipe(
        mergeBuffer(origin),
      ).subscribe(
        (result) => {
          log(result);
          expect((results.shift() || []).join(",")).to.be.eq(result.join(","));
        },
        undefined,
        () => {
          expect(results.length).to.be.eq(0);
        },
      );
      origin.connect();
    });

    it("Async", () => {
      const origin = timer(100, 200).pipe(take(5), map((v) => v + 1), publish()) as ConnectableObservable<number>;
      const P10 = origin.pipe(map((v) => v * 10));
      const P100 = origin.pipe(map((v) => v * 100));
      const Pdouble = origin.pipe(map((v) => of(v * 100 + 1, v * 100 + 2)), concatAll());
      const Odd = origin.pipe(filter((v) => v % 2 === 1), mapTo("Odd"));
      const results = [
        [1, 10, 100, 101, 102, "Odd"],
        [2, 20, 200, 201, 202],
        [3, 30, 300, 301, 302, "Odd"],
        [4, 40, 400, 401, 402],
        [5, 50, 500, 501, 502, "Odd"],
      ];
      return new Promise((resolve) => {
        of(origin , P10, P100, Pdouble, Odd).pipe(
          mergeBuffer(origin),
        ).subscribe(
          (result) => {
            log(result);
            expect((results.shift() || []).join(",")).to.be.eq(result.join(","));
          },
          undefined,
          () => {
            expect(results.length).to.be.eq(0);
            resolve();
          },
        );
        origin.connect();
      });
    });

    it("Error Handle", () => {
      const origin = timer(100, 200).pipe(take(5), map((v) => v + 1), publish()) as ConnectableObservable<number>;
      const P10 = origin.pipe(map((v) => {
        if (v === 3) {
          return throwError("Error Here");
        }
        return of(v * 10);
      }), concatAll());
      const P100 = origin.pipe(map((v) => v * 100));
      const Pdouble = origin.pipe(map((v) => of(v * 100 + 1, v * 100 + 2)), concatAll());
      const Odd = origin.pipe(filter((v) => v % 2 === 1), mapTo("Odd"));
      const results = [
        [1, 10, 100, 101, 102, "Odd"],
        [2, 20, 200, 201, 202],
      ];
      return new Promise((resolve, reject) => {
        of(origin, P10, P100, Pdouble, Odd).pipe(
          mergeBuffer(origin),
        ).subscribe(
          (result) => {
            log(result);
            expect((results.shift() || []).join(",")).to.be.eq(result.join(","));
          },
          (err) => {
            log("Error Caught ", err);
            expect(results.length).to.be.eq(0);
            resolve();
          },
          () => {
            reject("Never should be here!");
          },
        );
        origin.connect();
      });
    });

});
