# RxJS-Ext
![Language](https://img.shields.io/badge/-TypeScript-blue.svg)
[![Build Status](https://travis-ci.org/node-dmr/rxjs-ext.svg?branch=master)](https://travis-ci.org/node-dmr/rxjs-ext)
[![Coveralls](https://img.shields.io/coveralls/node-dmr/rxjs-ext.svg)](https://coveralls.io/github/node-dmr/rxjs-ext)
[![npm package](https://img.shields.io/npm/v/rxjs-ext.svg)](https://www.npmjs.org/package/rxjs-ext)
[![npm downloads](http://img.shields.io/npm/dm/rxjs-ext.svg)](https://www.npmjs.org/package/rxjs-ext)

# What's RxJS-Ext

RxJS Extensions是一个基于[RxJS^6.0](https://rxjs-dev.firebaseapp.com/) 提供的扩展编程库，提供了更多的
observable及operator帮助开发者快速编程，特别是数据分析领域。

- **rxjs-ext** 核心库
- **rxjs-ext/configuration** 配置化工具，可以将核心库/rxjs官方库的observable及operator生成依赖表
- **rxjs-ext/compile** 配置编译工具，可以结合依赖表，将yaml配置转化成rxjs程序
- **dmr-cli** yaml在线编辑工具，能够将符合rxjs-ext-config的配置结合依赖表生成rxjs程序并预览
- **dmr** 根据rxjs-ext-config驱动核心库运作满足各种业务需求的实例工程


# Hello RxJS

如果你没有RxJS的编程基础，可以通过以下这个最简单的demo先了解下RxJS的基本知识，如果你已经了解，可以前往[Usage](#Usage)。

```javascript
const source = of(1 , 2, 3).pipe(
  map((value) => value * 2),
);

source.subscribe(
  (value) => console.log(value),
  (err) => console.log(err),
  () => console.log("complete"),
);

// 2,  4,  6,  complete

```

上述是一个处理数据，并在完成后打印complete信息的程序，是一个RxJS程序标准的流程。RxJS有几个主要概念：
- observable 被观察者，主要提供待处理数据
- operator 操作符，相当于函数，对数据进行处理
- subscriber 通常定义三个函数，分别处理单个数据处理、异常捕获、执行完成回调

上述程序中，of(1 , 2, 3)生成observable对象，它有pipe(...operator[])方法，可指定多个操作符，如map处理数据。操作符处理完observable会返回一个新的observable，所以souce也是一个observable。最后observable使用subscribe传入subscriber（这里是匿名的），指定各种回调。

```javascript
observable.pipe(operator, operator, operator, operator)
```
RxJS的编程范式简单明确，官方提供了足够多的operator，但是RxJS-Ext提供了更多operator可以更快速实现数据形变。

# Usage

假设目前你已经了解RxJS的编程范式，接下来将简单介绍如何通过RxJS-Ext提供的observable、operator快速实现一个日志分析的案例。

## Observable

RxJS-Ext 封装了三个Observable，分别满足以FTP、HTTP、FILE形式获取数据，使用方式如：

```javascript
const file = "./local.log";
const data0 = fromHttp("http://localhost:8111/api");
const data1 = fromFtp({host: "127.0.0.1", path: "/err", port: 8880});
data0.pipe(shuntFile(file)).subscribe(() => null);
```
上述例子中通过fromHttp获取数据，并使用shuntFile操作符流式存到了file中。

```javascript
fromFile(file).subscribe(console.log);
```
如果需要流式读取这个文件，同样使用fromFile即可

## Operator

下面一个例子是获取本地日志，并且简单处理数据并存储的过程

```javascript

// logFile是一份mginx日志，combined是解析模板
const combined = `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"`;

const params = fromFile(logFile).pipe(
  line(),   // 流式数据需要通过line来进行按行\n切分
  deformat(combined),
  // 解析成{remote_addr: string, remote_user: string, ...}
  pluck("request"),
  // 选取request字段的内容，包含http地址
  matchAll(/(\w+)=(\w+)/g),
  // 按照正则匹配键值对字符串: "load=1200", "net=400" ...
  split("="),
  pair(),
  // 切割后，用pair转换为键值对: ["load", "1200"] , ["net", "400"] ...
  selectPair("load", "net", /ts_/g),
  // 筛选一些想要的数据
  csv(),
  shuntFile("./newFile.csv"), // 转换为csv格式并存入文件
);
```

上述过程中用到的
line、
deformat、
matchAll、
pair等操作符极大提升了数据分析的效率，和更多的操作符参见[API](https://node-dmr.github.io/rxjs-ext/)文档。

有时候，处理日志的场景会更为复杂，并不是一系列pipe就能满足的，我们可以结合RxJS多播类（Subject）实现，如下面例子，除了获取url里的字段外，还需要获取UA里的一些信息，一起存表。

```javascript

// logFile是一份mginx日志，combined是解析模板
const logJSON = fromFile(logFile).pipe(
  line(),
  deformat(combined),
  publish(), // 暂存为logJSON
);

const params = logJSON.pipe(
  pluck("request"),
  matchAll(/(\w+)=(\w+)/g),
  split("="),
  pair(),
);
const ua =  logJSON.pipe(
  pluck("http_user_agent"),
  uaInfo("sys", "borswer", "device")，
  // ["sys", "ios"], ["borswer", "safari"], ["device", "Huawei"]
);

// 将params、ua各自处理后的数据流以logJSON的频序merge再存入文件
of(params, ua).pipe(
  mergeBuffer(logJSON),
  csv(),
  shuntFile("./newFile.csv"),
)
```

至此，一个更为复杂的数据处理过程完成。

Rxt-JS 提供了其他运算类操作符，可以完成Map、Reduce的工作，计算指定条件下各字段的均值、80分位、分布等信息，详见高级技巧。

## Config

虽然基于rxjs-ext库可以极大提升数据编程效率，但是rxjs-ext的目标不止于此，我们希望可以使用更简洁的方式来编写或生成程序，而rxjs-ext-config是实现这个功能的中间步骤。

如上个实例，可以按照yaml的配置进行编写生成代码

```yaml
combined: `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"`

origin:
  - fromFile: ./nginx.log
  - line:
  - deformat: combined

params:
  - origin:
  - pluck: request
  - matchAll: /(\w+)=(\w+)/g
  - split: =
  - pair:

ua:
  - origin:
  - pluck: http_user_agent
  - uaInfo: [sys, borswer, device]

export:
  - megreBuffer:
    - params:
    - ua:
    - origin:
  - csv:
  - shuntFile: ./newFile.csv"

```

通过rxjs-ext/compile可以将上述代码编译成TS程序，或者进行语法检查，未来我们会提供其他语言版本（Python、Scalar、C++）的compile工具。
可以看到基于rxjs-ext库可以实现基于语言无关的配置来驱动业务实现，这份配置本身具备良好的阅读体验，配合CLI工具能够满足不同生成角色对数据挖掘的需求。

# API

* [https://node-dmr.github.io/rxjs-ext/](https://node-dmr.github.io/rxjs-ext/)
