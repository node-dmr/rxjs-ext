/*
 * @Author: qiansc
 * @Date: 2018-10-18 15:01:05
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-05 12:50:06
 */
import * as expression from "./expression";

export function resolve<T>(config: T): ((scope: {[index: string]: any}) => T)  {
  const configExpr = resolveItem(config);
  return (scope) => {
    return applyItem(configExpr, scope);
  };
}

function resolveItem<T>(item: T, key?: string| undefined): any {
  if (typeof item === "object") {
    // object
    if (Array.isArray(item)) {
      return resolveArray(item, key || "default");
    } else {
      const rs = {};
      Object.keys(item).forEach((index) => {
        rs[index] = resolveItem(item[index], index);
      });
      return rs;
      // return resolve<object> (item);
    }
  } else if (typeof item === "string") {
    // string or ExprLike
    return resolveString(item, key);
  } else {
    // others
    return item;
  }
}

function resolveArray(target: any[], parentKey: string): any[] {
  const rs: any[] = [];
  target.forEach((item, index) => {
    if (parentKey.match(/^(.*)\:(boolean|number)\[\]$/)) {
      rs.push(resolveItem(item, RegExp.$1 + ":" + RegExp.$2));
    } else {
      rs.push(resolveItem(item, index.toString()));
    }
  });
  return rs;
}

function resolveString(target: string, key?: string):
  string| expression.BooleanExpr| expression.NumberExpr |expression.StringExpr {
    if (expression.isExprLike(target)) {
      if (key && key.match(/^(.*)\:(boolean|number)$/)) {
        switch (RegExp.$2) {
          case "boolean":
            return expression.resolveBoolean(target);
          case "number":
            return expression.resolveNumber(target);
        }
      } else {
        return expression.resolve(target);
      }
    }
    return target;
}

function applyObject(obj: object, scope: {[index: string]: any}) {
  const rs: Option = {};
  Object.keys(obj).forEach((key) => {
    rs[key] = applyItem(obj[key], scope);
  });
  return rs;
}
export interface Config {
  [index: string]: ConfigItem;
}
export interface Option {
  [index: string]: OptionItem;
}
type Expression = expression.BooleanExpr | expression.StringExpr | expression.NumberExpr;
type OptionItem = object | string | number| boolean| Option | OptionItems;
type OptionItems = object[] | string[] | number[] | boolean[] | Option[];
type ConfigItem = object | any[]| string | number | Expression | Config;

function applyItem(
  item: ConfigItem,
  scope: {[index: string]: any},
): any {
  if (typeof item === "object") {
    // object
    if (Array.isArray(item)) {
      return applyArray(item, scope);
    } else {
      return applyObject(item, scope);
    }
  } else if (typeof item === "function") {
    // string or ExprLike
    return (item as Expression)(scope);
  } else {
    // others
    return item;
  }
}

function applyArray(target: OptionItems[], scope: {[index: string]: any}): any[] {
  const rs: any[] = [];
  target.forEach((item) => {
    rs.push(applyItem(item, scope));
  });
  return rs;
}
