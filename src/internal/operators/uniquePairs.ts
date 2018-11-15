/*
 * @Author: qiansc
 * @Date: 2018-11-15 09:55:02
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-15 13:13:52
 */
import { Observable, OperatorFunction } from "rxjs";
import { Pair } from "../types";

export function uniquePairs(type: "abandon" | "rename" | "cover" = "cover"): OperatorFunction<Pair[] , Pair[]> {
    return function UniquePairsOperation(source: Observable<Pair[]>): Observable<Pair[]> {
      return new Observable((observer) => {
        source.subscribe(
          (pairs) => {
            const keys: {[index: string]: number} = {};
            const newPairs: Pair[] = [];
            pairs.forEach((pair, i) => {
              if (type === "cover") {
                if (keys[pair[0]] === undefined) {
                  keys[pair[0]] =  newPairs.length;
                  newPairs.push(pair);
                } else if (pair[1] && pair[1] !== "undefined") {
                  newPairs[keys[pair[0]]] = pair;
                }
              } else {
                keys[pair[0]] = (keys[pair[0]] || 0) + 1;
                if (keys[pair[0]] === 1) {
                  newPairs.push(pair);
                } else if (type === "rename") {
                  newPairs.push([pair[0] + "_" + (keys[pair[0]] - 1), pair[1]]);
                }
              }
            });
            observer.next(newPairs);
          },
          (err) => {observer.error(err); },
          () => {observer.complete(); },
        );
      });
    };
}
