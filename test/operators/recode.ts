/*
 * @Author: qiansc
 * @Date: 2018-11-15 23:39:58
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-15 23:48:39
 */
import {expect} from "chai";
import {of} from "rxjs";
import {recode} from "../../src";
import log from "../extention/log";

describe("Recode Test", () => {

  it("decodeURI", () => {
    of("S/-%E5%95%8A0").pipe(recode("decodeURI")).subscribe(
      (v) => {
        log(v);
        expect(v).to.be.eq("S/-啊0");
      },
    );
  });
  it("decodeURIComponent", () => {
    of("S%E5%95%8A0").pipe(recode("decodeURIComponent")).subscribe(
      (v) => {
        log(v);
        expect(v).to.be.eq("S啊0");
      },
    );
  });
  it("encodeURI", () => {
    of("S/-啊0").pipe(recode("encodeURI")).subscribe(
      (v) => {
        log(v);
        expect(v).to.be.eq("S/-%E5%95%8A0");
      },
    );
  });
  it("encodeURIComponent", () => {
    of("S/-啊0").pipe(recode("encodeURIComponent")).subscribe(
      (v) => {
        log(v);
        expect(v).to.be.eq("S%2F-%E5%95%8A0");
      },
    );
  });

});
