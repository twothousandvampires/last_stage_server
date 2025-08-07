"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Builder_1 = require("./Classes/Builder");
var Client_1 = require("./Client");
var Item_1 = require("./Items/Item");
var Level_1 = require("./Level");
var GameServer = /** @class */ (function () {
    function GameServer(socket) {
        this.socket = socket;
        this.level = undefined;
        this.initSocket();
        this.clients = new Map();
        this.game_started = false;
    }
    GameServer.prototype.updateLobby = function () {
        var data = Array.from(this.clients.values());
        this.socket.emit('update_lobby_data', data, Item_1.default.list);
    };
    GameServer.prototype.createNewClient = function (socket) {
        var client = new Client_1.default(socket.id);
        this.clients.set(socket.id, client);
        this.updateLobby();
        return client;
    };
    GameServer.prototype.endOfLevel = function () {
        this.level = undefined;
        this.clients = new Map();
        clearInterval(this.game_loop);
        this.socket.emit('game_is_over');
    };
    GameServer.prototype.initSocket = function () {
        var _this = this;
        this.socket.on('connection', function (socket) {
            socket.emit('server_status', _this.game_started);
            if (!_this.game_started) {
                var client = _this.createNewClient(socket);
            }
            socket.on('change_class', function (class_name) {
                client.template.setTemplate(class_name);
                _this.updateLobby();
            });
            socket.on('increase_stat', function (stat) {
                client.template.increseStat(stat);
                _this.updateLobby();
            });
            socket.on('decrease_stat', function (stat) {
                client.template.decreaseStat(stat);
                _this.updateLobby();
            });
            socket.on('pick_item', function (item_name) {
                client.template.item = item_name;
                _this.updateLobby();
            });
            socket.on('unpick_item', function (item_name) {
                client.template.item = undefined;
                _this.updateLobby();
            });
            socket.on('select_skill', function (skill_name) {
                var selected = client.template.abilities.find(function (elem) { return elem.name === skill_name; });
                var type = selected === null || selected === void 0 ? void 0 : selected.type;
                client.template.abilities.filter(function (elem) { return elem.type === type; }).forEach(function (elem) { return elem.selected = false; });
                selected === null || selected === void 0 ? void 0 : selected.selected = true;
                _this.updateLobby();
            });
            socket.on('inputs', function (inputs) {
                var _a;
                (_a = client.character) === null || _a === void 0 ? void 0 : _a.setLastInputs(inputs);
            });
            socket.on('player_ready', function () {
                client.ready = !client.ready;
                if (_this.allPlayersReady()) {
                    setTimeout(function () {
                        var all_still_ready = _this.allPlayersReady();
                        if (all_still_ready) {
                            _this.level = new Level_1.default(_this.socket, _this);
                            _this.clients.forEach(function (value, key, map) {
                                var char = Builder_1.default.createCharacter(value, _this.level);
                                value.character = char;
                                _this.level.assignPlayer(char);
                            });
                            _this.game_started = true;
                            _this.level.start();
                            _this.socket.emit('start', Array.from(_this.clients.values()));
                            _this.start();
                        }
                    }, 3000);
                }
                _this.updateLobby();
            });
            socket.on('disconnect', function () {
                console.log('player LEFT');
                _this.clients.delete(socket.id);
                _this.updateLobby();
                if (_this.clients.size === 0) {
                    _this.level = undefined;
                    clearInterval(_this.game_loop);
                    _this.game_started = false;
                    console.log('level was DELETED');
                }
            });
            socket.on('action', function (id) {
                var _a, _b;
                var actor = (_a = _this.level) === null || _a === void 0 ? void 0 : _a.enemies.find(function (elem) {
                    return elem.id === id;
                });
                if (!actor) {
                    actor = (_b = _this.level) === null || _b === void 0 ? void 0 : _b.players.find(function (elem) {
                        return elem.id === id;
                    });
                }
                if (actor) {
                    actor.action = true;
                }
            });
            socket.on('set_target', function (id) {
                var _a;
                (_a = client.character) === null || _a === void 0 ? void 0 : _a.setTarget(id);
            });
            socket.on('select_upgrade', function (upgrade_name) {
                var _a;
                (_a = client.character) === null || _a === void 0 ? void 0 : _a.upgrade(upgrade_name);
            });
            socket.on('hold_grace', function () {
                var _a;
                (_a = client.character) === null || _a === void 0 ? void 0 : _a.holdGrace();
            });
        });
    };
    GameServer.prototype.allPlayersReady = function () {
        return Array.from((this.clients.values())).every(function (elem) { return elem.ready; });
    };
    GameServer.prototype.start = function () {
        var _this = this;
        this.game_loop = setInterval(function () {
            var _a, _b, _c, _d;
            if (!_this.level)
                return;
            var s = Date.now();
            _this.level.tick();
            _this.socket.emit('tick_data', _this.level);
            (_a = _this.level) === null || _a === void 0 ? void 0 : _a.collectTheDead();
            (_b = _this.level) === null || _b === void 0 ? void 0 : _b.effects.length = 0;
            (_c = _this.level) === null || _c === void 0 ? void 0 : _c.deleted.length = 0;
            (_d = _this.level) === null || _d === void 0 ? void 0 : _d.sounds.length = 0;
            // console.log(s- Date.now())
        }, 30);
    };
    return GameServer;
}());
exports.default = GameServer;
