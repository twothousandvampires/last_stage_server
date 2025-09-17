import { Server, Socket } from 'socket.io'
import Builder from './Classes/Builder'
import Client from './Client'
import item from './Items/Item'
import Level from './Level'
import TemplateAbility from './Types/TemplateAbility'
import Character from './Objects/src/Character'
const mysql = require('mysql2');

export default class GameServer{

    static MAX_PLAYERS: number = 6

    public socket: Server

    private level: Level | undefined = undefined
    private clients: Map<string, Client> = new Map()
    private game_started: boolean = false
    private realise: string = '1.0.0'
    private realise_name: string | undefined = undefined
    private start_scenario_name: string | undefined = undefined
    private remove_level_timeout: any
    db: any
    public db_is_connected: boolean = false

    new_game_timeout: any
    
    constructor(socket: Server){
        this.socket = socket
        this.initSocket()
    }

    public start(): void{
        if(!this.level) return

        this.level.start(this.start_scenario_name)
    }

    private updateLobby(): void{
        let data: Client[] = Array.from(this.clients.values())
        let p_items: string[] = []

        data.forEach(elem => {
            p_items.push(...elem.template.item.map((i => i.name)))
        })

        let list = item.list
        let available = []

        list.forEach(elem => {
            if(!p_items.includes(elem.name)){
                available.push(elem)
            }
        })

        this.socket.emit('update_lobby_data', data, available)
    }



    private createNewClient(socket: Socket): Client{
        let client: Client = new Client(socket.id)
        this.clients.set(socket.id, client)
        this.updateLobby()

        return client
    }

    public removeLevel(){
        clearTimeout(this.remove_level_timeout)
        this.level = undefined
        this.game_started = false
        this.start_scenario_name = undefined
        this.clients = new Map()
        this.socket.emit('game_is_over')
    }

    suggetRecord(player: Character){
        this.socket.to(player.id).emit('suggers_record', this.level?.kill_count)
    }

    addRecord(name, socket_id){
        if(!this.level) return
        let p = this.level.players[0]

        if(p.id != socket_id) return

        this.db.query( 'INSERT INTO game_stats (name, kills, time, class) VALUES (?, ?, ?, ?)',
        [name, this.level.kill_count, this.level.time - this.level.started, p.name],
        (err, results) => {
            if (err) {
                return;
            }
            console.log('Добавлена запись');
        })

        p.closeSuggest()
        this.removeLevel()
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
                    this.remove_level_timeout = setTimeout(() => {
                        this.removeLevel()
                    }, 20000)
                    this.suggetRecord(this.level?.players[0])
                }
                else{
                    this.removeLevel()
                }
            });
        }
        else{
            this.removeLevel()
        }
    }

     private initSocket() {

        this.db = mysql.createConnection({
            host: 'localhost',
            user: 'myuser',
            password: 'secure_password123',
            database: 'last_stage'
        });

        this.db.connect((err) => {
            if (err) {
                return;
            }
            this.db_is_connected = true
        });


        this.socket.on('connection', (socket: Socket) => {

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
                    this.addRecord(name, socket.id)
                })

                socket.on('set_start_scenario', (start_scenario_name) => {
                    this.start_scenario_name = start_scenario_name
                })

                socket.on('get_records', () => {

                    let result:any = []

                    if(this.db_is_connected){
                        this.db.query(`SELECT * FROM (SELECT * FROM game_stats WHERE class = 'swordman' ORDER BY kills DESC LIMIT 3) AS swordman_top UNION ALL SELECT * FROM (SELECT * FROM game_stats WHERE class = 'flyer' ORDER BY kills DESC LIMIT 3) AS flyer_top UNION ALL SELECT * FROM (SELECT * FROM game_stats WHERE class = 'cultist' ORDER BY kills DESC LIMIT 3) AS cultist_top;`,
                        (err, results) => {
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    
                                    result.push(results)
                                    socket.emit('records', JSON.stringify(result))
                                }
                            }
                        )

                        return
                    }
                 
                    socket.emit('records',[])
                })

                socket.on('increase_stat', (stat: string) => {
                    client.template.increseStat(stat)
                    this.updateLobby()                
                })

                socket.on('decrease_stat', (stat: string) => {
                    client.template.decreaseStat(stat)
                    this.updateLobby()                
                })

                socket.on('forge_item', (data) => {
                    if(!client.character) return

                    client.character.forgeItem(data)
            
                })

                socket.on('pick_item', (item_name: string) => {
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
                    client.character.unlockForging(item_name) 
                })

                socket.on('select_skill', (skill_name: string) => {
                    let selected: TemplateAbility | undefined = client.template.abilities.find(elem => elem.name === skill_name)
                    if(!selected) return

                    let type: number = selected.type
                    if(!type) return

                    client.template.abilities.filter(elem => elem.type === type).forEach(elem => elem.selected = false)
                    if(selected){
                        selected.selected = true;
                    }
                    this.updateLobby()                
                })

                socket.on('inputs', (inputs: object) => {   
                    if(!client.character) return

                    client.character.setLastInputs(inputs)
                })

                socket.on('buy', () => {   
                    if(!client.character) return

                    client.character.buyNewItem()
                })

                socket.on('buy_item', (id) => {   
                    if(!client.character) return

                    client.character.buyItem(id)
                })

                socket.on('pick_forging', (item_id, id) => {   
                    if(!client.character) return

                    client.character.pickForging(item_id, id)
                })

                socket.on('donate', () => {   
                    if(!client.character) return

                    client.character.gold -= 20
                    client.character.grace ++
                   
                    client.character.closeForgings()
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
                            }
                        }, 3000)
                    }

                    this.updateLobby()
                })

                socket.on('disconnect', () => {
                    this.clients.delete(socket.id)
                    this.updateLobby()

                    if(this.clients.size === 0){
                        if(this.level){
                            this.level.endGame()
                        }
                    }
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
                    client.character.holdGrace()
                })

                socket.on('exit_grace', () => {
                    if(!client.character) return
                    client.character.exitGrace()
                })
            }
        })
    }

    allPlayersAreReady(): boolean{
        return Array.from((this.clients.values())).every(elem => elem.ready)
    }
}