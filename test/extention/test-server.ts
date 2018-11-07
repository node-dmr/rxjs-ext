/*
 * @Author: qiansc
 * @Date: 2018-07-27 16:22:15
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-11-06 10:32:03
 */

import * as http from "http";
let server;
let timmer;

export function start(config) {
    config =  config || {};
    stop();
    server = http.createServer((request, response) => {
      if (request.url && request.url.indexOf("HOLD") > -1) {
        console.log("HOLD REQUEST...");
        // hold link for timeout
      } else if (request.url && request.url.indexOf("WAIT") > -1) {
        console.log("HOLD RESPONSE...");
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("PLEASE WAIT...");
        setTimeout(() => {
          response.write("300ms PASSED...");
        }, 300);
        // hold link for timeout
      } else {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end(config.content || "hello dmr\nsuccess");
      }
    });
    server.listen(config.port || 8088);
    server.setTimeout(1000, () => {
      console.log("Server Timeout");
    });
    // 终端打印如下信息
    console.log("\x1B[90mTest Server running at http://127.0.0.1:%s/\x1B[39m", config.port || 8088);

    timmer = setTimeout(() => {
        this.stop();
    }, config.timeOut || 2000);
}

export function stop() {
    if (server) {
        server.close();
        clearTimeout(timmer);
    }
}
