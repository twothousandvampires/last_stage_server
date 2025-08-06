import {createRequire} from "module";
import GameServer from './GameServer'

const create_require = createRequire(require('url').pathToFileURL(__filename).toString());
const http = create_require("http");

const { Server } = create_require("socket.io");

const port = 9001;

const requestListener = (req: any, res: any) => {
    res.writeHead(200);
};

const server = http.createServer(requestListener);
const io = new Server(server, { cors: { origin: '*' } });

const Game: GameServer = new GameServer(io)

server.listen(port,() => {
    console.log(`Server is running on :${port}`);
});

Game.start();