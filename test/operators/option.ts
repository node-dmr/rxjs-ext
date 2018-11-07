/*
 * @Author: qiansc
 * @Date: 2018-11-05 13:16:09
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-05 13:40:03
 */
import {expect} from "chai";
import {of} from "rxjs";
import {option} from "../../src";
describe("Operator Option Test", () => {
  it("String Tpl", () => {
    return new Promise((resolve, reject) => {
      const result: string[] = [];
      const str = of({
        date: "20080901",
        dir: __dirname,
      }, {
        date: "20080902",
        dir: __dirname,
      }).pipe(
        option({
          file: "`${dir}/${date}.log`",
        }),
      ).subscribe(
        (v) => result.push(v.file),
        undefined,
        () => {
          if (result.length === 2) {
            console.log(result);
            expect(result[0]).to.be.eq(__dirname + "/20080901.log");
            expect(result[1]).to.be.eq(__dirname + "/20080902.log");
            resolve();
          } else {
            reject();
          }
        });
    });

  });
});
