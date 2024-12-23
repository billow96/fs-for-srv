const express = require("express");
const { exec } = require("child_process");
const app = express();
const fs = require("fs");
const path = require("path");

// 日志文件路径
const logFilePath = path.join(__dirname, "frps.log");

// 通用日志记录函数
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    // 写入日志文件，追加模式，确保中文正常显示
    // fs.appendFileSync(logFilePath, logMessage, { encoding: "utf8" });

    // 同时输出到控制台
    console.log(message);
}

app.get("/info", function (req, res) {
    res.type("html").send("<pre>Powered by X-Serv00\nAuthor: <a href='https://github.com/kaya'>Kaya</a>" + "</pre>");
});

function keep_frps_alive() {
    exec("pgrep -laf frps", function (err, stdout, stderr) {
        if (stdout.includes("./frp/frps -c ./frp/frps.toml")) {
            log("frps 正在运行");
        } else {
            exec(
                "chmod +x ./frp/frps && ./frp/frps -c ./frp/frps.toml > /dev/null 2>&1 &",
                function (err, stdout, stderr) {
                    if (err) {
                        log("保活-调起frps-命令行执行错误: " + err);
                    } else {
                        log("保活-调起frps-命令行执行成功!");
                    }
                }
            );
        }
    });
}

// 定时执行
setInterval(keep_frps_alive, 30 * 1000);

app.listen(3000, () => console.log(`Example app listening on port 3000!`));
