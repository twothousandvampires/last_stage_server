"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var module_1 = require("module");
var GameServer_1 = require("./src/GameServer");
// @ts-ignore
var create_require = (0, module_1.createRequire)(require('url').pathToFileURL(__filename).toString());
var http = create_require("http");
var Server = create_require("socket.io").Server;
var port = 9001;
var requestListener = function (req, res) {
    res.writeHead(200);
};
var server = http.createServer(requestListener);
var io = new Server(server, { cors: { origin: '*' } });
var Game = new GameServer_1.default(io);
server.listen(port, function () {
    console.log("Server is running on :".concat(port));
});
Game.start();
