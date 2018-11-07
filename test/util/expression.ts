/*
 * @Author: qiansc
 * @Date: 2018-10-17 17:13:00
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-05 09:58:14
 */
import {expect} from "chai";
import {expression} from "../../src/internal/util";
describe("Expression Test", () => {
  it("Expression String Test", () => {
    let exp: expression.StringExpr;
    exp = expression.resolve("123");
    expect(exp({})).to.be.eq("123");

    exp = expression.resolve("`${234}`");
    expect(exp({})).to.be.eq("234");

    exp = expression.resolve("`${A + B}`");
    expect(exp({A: 1, B: 3})).to.be.eq("4");

    exp = expression.resolve("`P${S + K.A}`");
    expect(exp({S: 1, K: {A: "TT"}})).to.be.eq("P1TT");
  });

  it("Expression Boolean Test", () => {
    let exp: expression.BooleanExpr;
    exp = expression.resolveBoolean("123");
    expect(exp({})).to.be.eq(false);

    exp = expression.resolveBoolean("`${1 == 1}`");
    expect(exp({})).to.be.eq(true);

    exp = expression.resolveBoolean("`${A + 1 === B}`");
    expect(exp({A: 99, B: 100})).to.be.eq(true);

    exp = expression.resolveBoolean("`S${A + 1 === B}`");
    expect(exp({A: 99, B: 100})).to.be.eq(false);
  });

  it("Expression Number Test", () => {
    let exp: expression.NumberExpr;
    exp = expression.resolveNumber("123");
    expect(exp({})).to.be.eq(123);

    exp = expression.resolveNumber("`${99 + 2}`");
    expect(exp({})).to.be.eq(101);

    exp = expression.resolveNumber("`${A + B}`");
    expect(exp({A: 99, B: 100})).to.be.eq(199);

    exp = expression.resolveNumber("`${B + A + B}`");
    const a = expect(exp({A: 99, B: "S1"})).to.be.NaN;
  });
});
