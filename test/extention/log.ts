/*
 * @Author: qiansc
 * @Date: 2018-08-02 19:13:30
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-06 10:08:05
 */
const Log = (...args: any[]): void => {
  const result: string[] = [];
  const type: string[] = [];
  Array.prototype.slice.apply(args).forEach((element) => {
      if (element instanceof Error) {
        result.push(element.name + "\n" + element.message);
        type.push("%s");
      } else if (typeof element === "object") {
          result.push(JSON.stringify(element));
          type.push("%s");
      } else {
          result.push(element.toString());
          type.push("%s");
      }
  });
  let arr = ["\x1B[90m" + type.join("") + "\x1B[39m"];
  arr = arr.concat(result);
  console.log.apply(null, arr);
};

export default Log;
