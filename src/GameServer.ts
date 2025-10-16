
import Builder from './Classes/Builder'
import Client from './Client'
import item from './Items/Item'
import Level from './Level'
import TemplateAbility from './Types/TemplateAbility'
import Character from './Objects/src/Character'
import UpgradeManager from './Classes/UpgradeManager'
const mysql = require('mysql2')

import { createServer } from 'http'
import { Server } from 'socket.io'
import { createClient } from 'redis'
import Default from './Scenarios/Default'

let port = process.argv[2]
let httpServer = createServer()
let socket = new Server(httpServer, { cors: { origin: '*' } })
     
httpServer.listen(port)

class GameServer{

    static MAX_PLAYERS: number = 6

    public socket: Server
    private level: Level | undefined = undefined
    private clients: Map<string, Client> = new Map()
    private game_started: boolean = false
    private realise: string = '1.0.0'
    private realise_name: string | undefined = undefined
    private start_scenario_name: string | undefined = undefined

    db: any
    public db_is_connected: boolean = false

    new_game_timeout: any
    httpServer: any
    port: any
    redisClient: any
    name: string
    
    constructor(socket: any, port: any){
        this.port = port
        this.socket = socket
        this.redisClient = createClient()
        this.name = ''
    }

    private async updateRedisLobby(): Promise<void> {
        let lobbyInfo = {
            port: this.port.toString(),
            players: this.clients.size.toString(),
            maxPlayers: GameServer.MAX_PLAYERS.toString(),
            name: this.name.toString(),
            started: this.game_started.toString(),
        }

        await this.redisClient.hSet(`lobby:${this.port}`, lobbyInfo)

        await this.redisClient.publish('lobby_updates', 'updated')
    }

    private async initializeRedis(): Promise<void> {
        await this.redisClient.connect()
        
        let lobbyInfo = {
            port: this.port.toString(),
            players: this.clients.size.toString(),
            maxPlayers: GameServer.MAX_PLAYERS.toString(),
            name: this.name.toString(),
            started: this.game_started.toString(),
        }

        await this.redisClient.hSet(`lobby:${this.port}`, lobbyInfo)
    }

    public start(): void{
        if(!this.level) return

        this.level.start(this.start_scenario_name)
    }

    getAllPlayersItems(data){
        let p_items: string[] = []

        data.forEach(elem => {
            p_items.push(...elem.template.item.map((i => i.name)))
        })

        return p_items
    }

    private updateLobby(): void{
        let data: Client[] = Array.from(this.clients.values())
  
        let p_items = this.getAllPlayersItems(data)
        let list = item.list
        let available = []

        list.forEach(elem => {
            if(!p_items.includes(elem.name)){
                available.push(elem)
            }
        })
        
        this.socket.emit('update_lobby_data', data, available)
    }

    private createName(){
        let first = ['brutal', 'grimy', 'cold', 'rotten', 'black', 'demented', 'gone', 'bloody', 'lifeless', 'stinking', 'frightening','gigantic', 'smashed', 'bleak', 'sinister', 'ominous']
        let second = ['mace', 'head', 'mind', 'ceil', 'remains', 'ghoul', 'tree', 'corpse', 'gem', 'shards', 'bloat', 'phantom', 'melancholy', 'woe', 'maggot' ,'phlegm']

        this.name = first[Math.floor(Math.random() * first.length)] + ' ' + second[Math.floor(Math.random() * second.length)]
    }

    private createNewClient(socket: Socket): Client{
        let client: Client = new Client(socket.id)
        this.clients.set(socket.id, client)
        this.updateLobby()
        this.updateRedisLobby()

        return client
    }

    public removeLevel(){
        this.level = undefined
        this.game_started = false
        this.start_scenario_name = undefined
        this.clients = new Map()
        this.socket.emit('game_is_over')
    }

    async suggetRecord(player: Character){
        if(!this.level) return

        await this.redisClient.setEx(player.id, 60, JSON.stringify({
            kill_count: this.level.kill_count,
            waves: this.level.script instanceof Default ? this.level.script.waves_created : 0,
            time: this.level.time - this.level.started,
            class: player.name
        }))
        
        console.log('in suggest')
        this.socket.to(player.id).emit('suggers_record', this.level.kill_count)
    }

    async addRecord(name: string, id: string){
        console.log(name, id)
        let info = await this.redisClient.get(id)
        info = JSON.parse(info)

        if(info && name){
            this.db.query( 'INSERT INTO game_stats (name, kills, waves, time, class) VALUES (?, ?, ?, ?, ?)',
            [name, info.kill_count, info.waves, info.time, info.class],
            (err, results) => {
                this.removeLevel()
            })
        }
        else{

            this.removeLevel()
        }
        
    }

    public endOfLevel(): void{
        if(this.db_is_connected && this.level?.players.length === 1){
            this.db.query('SELECT * FROM game_stats WHERE class = ? ORDER BY kills DESC LIMIT 3', 
            [this.level?.players[0].name], 
            (err, results) => {
                if (err) {
                    return
                }
                let more = true

                if(results.length > 2 && results.every(elem => elem.kills >= this.level?.kill_count)){
                    more = false
                }
                
                if(more){
                    this.suggetRecord(this.level?.players[0])
                }
                else{
                    this.removeLevel()
                }
            })
        }
        else{
            this.removeLevel()
        }
    }

    initSocket() {
        this.createName()
        this.initializeRedis()
        
        this.db = mysql.createConnection({
            host: 'localhost',
            user: 'myuser',
            password: 'secure_password123',
            database: 'last_stage'
        })

        this.db.connect((err) => {
            if (err) {
                return
            }
            this.db_is_connected = true
        })

        this.socket.on('connection', (socket: Socket) => {
            socket.emit('connect_to_lobby')
 
            socket.emit('server_status', {
                status: this.game_started || (this.clients.size >= GameServer.MAX_PLAYERS),
                realise: this.realise,
                realise_name: this.realise_name
            })

            if(!this.game_started && this.clients.size < GameServer.MAX_PLAYERS){
                let client: Client = this.createNewClient(socket)

                socket.on('change_class', (class_name: string) => {
                    client.template.setTemplate(class_name)
                    this.updateLobby()                
                })

                socket.on('add_record' ,(name) => {
                    console.log(name)
                    this.addRecord(name, socket.id)
                })

                socket.on('set_start_scenario', (start_scenario_name) => {
                    this.start_scenario_name = start_scenario_name
                })

                socket.on('increase_stat', (stat: string) => {
                    client.template.increseStat(stat)
                    this.updateLobby()                
                })

                socket.on('decrease_stat', (stat: string) => {
                    client.template.decreaseStat(stat)
                    this.updateLobby()                
                })

                socket.on('get_lobby_data', () => {
                    this.updateLobby()  
                })

                socket.on('forge_item', (data) => {
                    if(!client.character) return

                    UpgradeManager.forgeItem(data, client.character)
            
                })

                socket.on('pick_item', (item_name: string) => {
                    let data: Client[] = Array.from(this.clients.values())
                    let items = this.getAllPlayersItems(data)
                    if(items.some(elem => elem === item_name)) return

                    let item = Builder.createItem(item_name)

                    if(client.template.item.length >= client.template.max_items){
                        client.template.item.pop()
                    }
        
                    client.template.item.push(item)
                     
                    this.updateLobby()                
                })

                socket.on('unpick_item', (item_name: string) => {
                    client.template.item = client.template.item.filter(elem => elem.name != item_name)
                    this.updateLobby()                
                })

                socket.on('unlock_forging', (item_name: string) => {
                    if(!client.character) return

                    UpgradeManager.unlockForging(item_name, client.character) 
                })

                socket.on('select_skill', (skill_name: string) => {
                    let selected: TemplateAbility | undefined = client.template.abilities.find(elem => elem.name === skill_name)
                    if(!selected) return

                    let type: number = selected.type
                    if(!type) return

                    client.template.abilities.filter(elem => elem.type === type).forEach(elem => elem.selected = false)
                    if(selected){
                        selected.selected = true
                    }
                    this.updateLobby()                
                })

                socket.on('inputs', (inputs: object) => {   
                    if(!client.character) return

                    client.character.setLastInputs(inputs)
                })

                socket.on('buy', () => {   
                    if(!client.character) return

                    UpgradeManager.buyNewItem(client.character)
                })

                socket.on('load_template', (data) => {
                    try{
                        client.template.abilities = data.abilities
                        client.template.item = []

                        data.item.forEach(elem => {
                            if(elem.name != ''){
                                let item = Builder.createItem(elem.name)
                                client.template.item.push(item)
                            }
                            
                        })
                        client.template.stats = data.stats
                        client.template.stat_count = data.stat_count

                        this.updateLobby()
                    } catch(e){
                        console.log(data)
                        console.log(e)
                    }
                    
                })

                socket.on('buy_item', (id) => {   
                    if(!client.character) return

                    UpgradeManager.buyItem(id, client.character)
                })

                socket.on('pick_forging', (item_id, id) => {   
                    if(!client.character) return

                    UpgradeManager.pickForging(item_id, id, client.character)
                })

                socket.on('donate', () => {   
                    if(!client.character) return

                    client.character.gold -= 20
                    client.character.grace ++
                   
                    UpgradeManager.closeForgings(client.character)
                })

                socket.on('player_ready', () => {

                    client.ready = !client.ready

                    if(this.allPlayersAreReady()){
                        clearTimeout(this.new_game_timeout)
                        
                        this.new_game_timeout = setTimeout(() => {
                            let all_still_ready: boolean = this.allPlayersAreReady()
                            if(all_still_ready){
                                this.level = new Level(this)

                                this.clients.forEach((value, key, map) => {
                                    if(this.level){
                                        let char: Character = Builder.createCharacter(value, this.level)
                                        value.character = char
                                        this.level.assignPlayer(char)
                                    }
                                })
                                
                                this.game_started = true
                                this.socket.emit('start', Array.from(this.clients.values()))
                                this.level.start(this.start_scenario_name)
                                this.updateRedisLobby()
                            }
                        }, 3000)
                    }

                    this.updateLobby()
                })

                socket.on('disconnect', () => {
                    this.clients.delete(socket.id)
                    
                    if(this.clients.size === 0){
                        if(this.level){
                            clearImmediate(this.level.game_loop)
                            this.removeLevel()
                            this.createName()
                            
                        }
                    }
                    else{
                        this.updateLobby()
                    }     
                    this.updateRedisLobby()  
                })
                
                socket.on('set_target', (id) => {
                    if(!client.character) return
                    client.character.setTarget(id)
                })

                socket.on('select_upgrade', (upgrade_name) => {
                    if(!client.character) return

                    client.character.upgrade(upgrade_name)
                })

                socket.on('hold_grace', () => {
                    if(!client.character) return

                    UpgradeManager.holdGrace(client.character)
                })

                socket.on('hold_ascend', () => {
                    if(!client.character) return

                    UpgradeManager.holdAscend(client.character)
                })

                socket.on('exit_grace', () => {
                    if(!client.character) return
                    client.character.exitGrace()
                })

                socket.on('sacrifice', () => {
                    if(!client.character) return

                    UpgradeManager.sacrifice(client.character)
                })
            }
        })
    }

    allPlayersAreReady(): boolean{
        return Array.from((this.clients.values())).every(elem => elem.ready)
    }
}

let lobby = new GameServer(socket, port)
lobby.initSocket()