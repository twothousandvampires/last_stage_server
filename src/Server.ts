import { Server as SocketServer, Socket } from 'socket.io'
import { createClient, RedisClientType } from 'redis'
const mysql = require('mysql2')
import * as fs from 'fs';
import * as path from 'path';

process.on('uncaughtException', (error) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] Uncaught Exception: ${error.message}\n`;
  fs.appendFileSync(logPath, logMessage);
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] Unhandled Rejection at: ${promise}, reason: ${reason}\n`;
  fs.appendFileSync(logPath, logMessage);
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const logPath = path.join(__dirname, 'log.text');

export default class MasterServer {
  
  private io: SocketServer
  private port: number
  private redisClient: RedisClientType
  private db: any
  private lobbies: Map<number, any> = new Map();
  private logStream: fs.WriteStream;

  constructor(io: SocketServer, port: number) {
    this.io = io
    this.port = port
    
    this.logStream = fs.createWriteStream(logPath, { flags: 'a' });
    this.log('Master server started');
    this.redisClient = createClient()

    this.db = mysql.createPool({
      host: 'localhost',
      user: 'myuser',
      password: 'secure_password123',
      database: 'last_stage',
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });

    // Обработчик ошибок пула
    this.db.on('error', (err) => {
      this.log(`Database pool error: ${err.message}`);
    });
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    this.logStream.write(logMessage);
  }

  async initialize(): Promise<void> {
    await this.setupRedis()
    this.startGameServers()
    this.setupSocketHandlers()
    this.setupMasterCleanup()
    this.setupRedisSubscriptions()
  }

  private async setupRedisSubscriptions(): Promise<void> {
    let subscriber = this.redisClient.duplicate()
    await subscriber.connect()

    await subscriber.subscribe('lobby_updates', async (message) => {
      let lobbies = await this.getAllLobbies()
      this.io.emit('lobbies_list', lobbies)
    })
  }

  private async setupRedis(): Promise<void> {
    this.redisClient.on('error', (err) => console.log('Redis Client Error'))
    await this.redisClient.connect()
  }

  private setupMasterCleanup(): void {
    this.cleanupAllLobbies()

    process.on('SIGINT', async () => {
      await this.cleanupAllLobbies()
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      await this.cleanupAllLobbies()
      process.exit(0)
    })
  }

  private async cleanupAllLobbies(): Promise<void> {
    let keys = await this.redisClient.keys('lobby:*')
    
    if (keys.length > 0) {
        await this.redisClient.del(keys)
    } else {
        
    }
  }

  private startGameServers(): void {
    this.cleanupAllLobbies()
    let count = require('os').cpus().length * 2

    if(count > 10){
      count = 10
    }

    for (let i = 0; i < count; i++) {
      let port = 9002 + i

      let { spawn } = require('child_process')
      let path = require('path')
      
      const gameProcess = spawn('node', [path.join(__dirname, 'GameServer.js'),  port.toString()], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']  // ВКЛЮЧАЕМ IPC
      });

      gameProcess.on('message', (message) => {
          if (message.type === 'register_lobby') {
              this.lobbies.set(port, message.data);
              console.log(`Lobby registered: ${port}`);
          }
          else if (message.type === 'update_lobby') {
              if (this.lobbies.has(port)) {
                  this.lobbies.set(port, message.data);
                  this.io.emit('lobbies_list', Array.from(this.lobbies.values()));
              }
          }
      });

      gameProcess.on('exit', (code) => {
          if (code === 0) {
              this.log(`GameServer ${port} exited normally`);
          } else {
              // Логируем падение с ошибкой
              this.log(`GameServer ${port} CRASHED - Code: ${code}`);
          }
          console.log(`GameServer ${port} exited with code ${code}`);
          this.lobbies.delete(port);
      });

      gameProcess.on('error', (error) => {
          this.log(`GameServer ${port} spawn error: ${error.message}`);
      });
    }
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', async (socket: Socket) => {

      socket.on('get_lobbies', async () => {
        socket.emit('lobbies_list', Array.from(this.lobbies.values()));
      })

      socket.on('get_records', async () => {
        try {
          // ИСПОЛЬЗОВАТЬ promise() для работы с async/await
          const [results] = await this.db.promise().query(
            `SELECT * FROM (SELECT * FROM game_stats WHERE class = 'swordman' ORDER BY kills DESC LIMIT 3) AS swordman_top UNION ALL SELECT * FROM (SELECT * FROM game_stats WHERE class = 'flyer' ORDER BY kills DESC LIMIT 3) AS flyer_top UNION ALL SELECT * FROM (SELECT * FROM game_stats WHERE class = 'cultist' ORDER BY kills DESC LIMIT 3) AS cultist_top;`
          );

          socket.emit('records', JSON.stringify(results));
        } catch (err) {
          this.log(`Database query error: ${err.message}`);
          // Отправляем пустой массив вместо падения
          socket.emit('records', []);
        }
      })
    })
  }

  private async getAllLobbies(): Promise<any[]> {
    let keys = await this.redisClient.keys('lobby:*')
    let lobbies: any[] = []
    
    for (const key of keys) {
      let lobbyData = await this.redisClient.hGetAll(key)
      lobbies.push(lobbyData)
    }
    
    return lobbies
  }
}