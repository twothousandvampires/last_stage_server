import { Server as SocketServer, Socket } from 'socket.io'
import { createClient, RedisClientType } from 'redis'

export default class MasterServer {
  
  private io: SocketServer
  private port: number
  private redisClient: RedisClientType

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
      
      spawn('node', [
        path.join(__dirname, 'GameServer.js'), 
        port.toString()
      ], {
        stdio: 'inherit',
        shell: true
      })

      console.log(`GameServer started on port ${port}`)
    }
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', async (socket: Socket) => {
      socket.on('get_lobbies', async () => {
        let lobbies = await this.getAllLobbies()
        socket.emit('lobbies_list', lobbies)
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