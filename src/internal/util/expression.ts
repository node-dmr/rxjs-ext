/*
 * @Author: qiansc
 * @Date: 2018-10-17 10:42:16
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-18 15:00:29
 */

/*
 * ExprLike is string type such as "`....`". The part of `...` is ES6 TemplateString
 * ExprLike can be resolve by ExprLike.resolve to a function: <T>(scope) => <T>
 * @exapmple
 */
type ExprLike = string;
export type StringExpr = (scope: {[index: string]: any}) => string;
export type BooleanExpr = (scope: {[index: string]: any}) => boolean;
export type NumberExpr = (scope: {[index: string]: any}) => number;

export function isExprLike(str: string): (boolean | RegExpMatchArray) {
  const matches = str.match(/^`.*`$/);
  if (matches) {
    return matches;
  }
  return false;
}

export function resolve(exprLike: ExprLike): StringExpr {
  const matches = isExprLike(exprLike);
  if (!matches) {
    return (scope: {[index: string]: any}) => exprLike;
  } else {
    return (scope: {[index: string]: any}) => {
      const keys: string[] = [];
      const values: any[] = [];
      Object.keys(scope).forEach((key) => {
        keys.push(key);
        values.push(scope[key]);
      });
      let func: (...value: any []) => string;
      func = eval.call (null, `(${keys.join(",")}) => ${exprLike}`);
      return func(...values);
    };
  }
}

export function resolveBoolean(exprLike: ExprLike): BooleanExpr {
  return (scope: {[index: string]: any}) => {
    const rs = resolve(exprLike)(scope);
    if (rs === "true") {
      return true;
    }
    return false;
  };
}

export function resolveNumber(exprLike: ExprLike): NumberExpr {
  return (scope: {[index: string]: any}) => {
    const rs = resolve(exprLike)(scope);
    return parseFloat(rs);
  };
}
