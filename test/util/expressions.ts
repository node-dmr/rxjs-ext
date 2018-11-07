/*
 * @Author: qiansc
 * @Date: 2018-10-17 17:13:00
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-05 13:44:41
 */
import {expect} from "chai";
import {expression, expressions} from "../../src/internal/util";
describe("Expressions Test", () => {
  interface Config extends expressions.Config {
    expr: expression.StringExpr;
    "expr1:boolean": expression.BooleanExpr;
    obj: {
      A: expression.StringExpr,
      B: [expression.StringExpr, string],
      "C:number[]": [expression.StringExpr, string],
    };
  }

  const scope = {
    A: 1,
    B: "2",
    expr: "ex",
  };
  it("A", () => {
    const config = {
      "expr": "`${expr}`",
      "expr0:boolean": "error",
      "expr1:boolean": "`f`",
      "expr2:boolean": "`true`",
      "expr3:boolean": "`${A === B}`",
      "expr4:boolean": "`H${A === B}`",
      "expr5:boolean": "`${A *1 + 1 === B * 1}`",
      "expr6:number": "`H${A === B}`",
      "expr7:number": "`${A + B}`",
      "exprA+B": "`${A + B * 1}`",
      "exprSA+B": "`S${A + B}`",
      "obj": {
        "A": "`${A}`",
        "B": ["`${A}`", "A"],
        "C:number[]": ["`${A}`", "A"],
      },
      "string": "string",
      "z:number": ["`${A}`", "A"],
      "zz": 1,
    };
    const configExpr = expressions.resolve(config);

    interface Option extends expressions.Option {
      obj: expressions.Option;
    }
    const option = configExpr(scope);

    console.log(option);

    expect(option.expr).to.be.eq("ex");
    expect(option["expr0:boolean"]).to.be.eq("error");
    expect(option["expr1:boolean"]).to.be.eq(false);
    expect(option["expr2:boolean"]).to.be.eq(true);
    expect(option["expr3:boolean"]).to.be.eq(false);
    expect(option["expr4:boolean"]).to.be.eq(false);
    expect(option["expr5:boolean"]).to.be.eq(true);
    const s = expect(option["expr6:number"]).to.be.NaN;
    expect(option["expr7:number"]).to.be.eq(12);
    expect(option["exprA+B"]).to.be.eq("3");
    expect(option["exprSA+B"]).to.be.eq("S12");
    expect(option.obj.A).to.be.eq("1");
    expect(option.obj.B[0]).to.be.eq("1");
    expect(option.obj.B[1]).to.be.eq("A");
    expect(option.obj["C:number[]"][0]).to.be.eq(1);
    expect(option.obj["C:number[]"][1]).to.be.eq("A");
    expect(option.string).to.be.eq("string");
    expect(option["z:number"][0]).to.be.eq("1");
    expect(option["z:number"][1]).to.be.eq("A");
    expect(option.zz).to.be.eq(1);
  });

  it("Expressions Apply String Test", () => {
    const ss = expressions.resolve("`${value}123`");
    expect(ss({
      value: "love",
    })).to.be.eq("love123");
  });

  it("Expressions Apply String[] Test", () => {
    const ss = expressions.resolve(["`${value}0`", "`${value}1`"]);
    const rs = ss({
      value: "love",
    });
    expect(rs[0]).to.be.eq("love0");
    expect(rs[1]).to.be.eq("love1");
  });
});
