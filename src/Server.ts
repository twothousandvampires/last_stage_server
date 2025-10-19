import { Server as SocketServer, Socket } from 'socket.io'
import { createClient, RedisClientType } from 'redis'
const mysql = require('mysql2')

export default class MasterServer {
  
  private io: SocketServer
  private port: number
  private redisClient: RedisClientType
  private db: any
  private lobbies: Map<number, any> = new Map();

  constructor(io: SocketServer, port: number) {
    this.io = io
    this.port = port
    this.redisClient = createClient()
  }

  async initialize(): Promise<void> {
    await this.setupRedis()
    this.startGameServers()
    this.setupSocketHandlers()
    this.setupMasterCleanup()
    this.setupRedisSubscriptions()
    this.db = mysql.createConnection({
        host: 'localhost',
        user: 'myuser',
        password: 'secure_password123',
        database: 'last_stage'
    })

    this.db.connect()
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
    console.log('Connected to Redis')
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
        console.log(`Removed ${keys.length} lobbies from Redis`)
    } else {
        console.log('No lobbies to clean up')
    }
  }

  private startGameServers(): void {
    this.cleanupAllLobbies()
    let count = require('os').cpus().length

    console.log(`Starting ${count} game server processes...`)

    

    for (let i = 0; i < count; i++) {
      let port = 9002 + i

      let { spawn } = require('child_process')
      let path = require('path')
      
      const gameProcess = spawn('node', [path.join(__dirname, 'GameServer.js'),  port.toString()], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']  // ВКЛЮЧАЕМ IPC
      });

      // Получаем сообщения от GameServer
      gameProcess.on('message', (message) => {
          if (message.type === 'register_lobby') {
              this.lobbies.set(port, message.data);
              console.log(`✅ Lobby registered: ${port}`);
          }
          else if (message.type === 'update_lobby') {
              if (this.lobbies.has(port)) {
                  const existing = this.lobbies.get(port);
                  this.lobbies.set(port, { ...existing, ...message.data });
              }
          }
      });

      gameProcess.on('exit', (code) => {
          console.log(`GameServer ${port} exited with code ${code}`);
          this.lobbies.delete(port);
      });
    }
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', async (socket: Socket) => {
      socket.on('get_lobbies', async () => {
        socket.emit('lobbies_list', Array.from(this.lobbies.values()));
      })

      socket.on('get_records', () => {
        this.db.query(`SELECT * FROM (SELECT * FROM game_stats WHERE class = 'swordman' ORDER BY kills DESC LIMIT 3) AS swordman_top UNION ALL SELECT * FROM (SELECT * FROM game_stats WHERE class = 'flyer' ORDER BY kills DESC LIMIT 3) AS flyer_top UNION ALL SELECT * FROM (SELECT * FROM game_stats WHERE class = 'cultist' ORDER BY kills DESC LIMIT 3) AS cultist_top;`,
        (err, results) => {
                if(err){
                    console.log(err)
                }
                else{
                    socket.emit('records', JSON.stringify(results))
                }
            }
        )

        socket.emit('records',[])
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