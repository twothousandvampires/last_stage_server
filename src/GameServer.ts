import Builder from './Classes/Builder'
import Client from './Client'
import Item from './Items/Item'
import item from './Items/Item'
import Level from './Level'
const mysql = require('mysql2');

export default class GameServer{

    socket: any
    level: Level | undefined
    clients: any
    game_started: boolean
    game_loop: any

    constructor(socket: any){
        this.socket = socket
        this.level = undefined
        this.initSocket()
        this.clients = new Map()
        this.game_started = false
    }

    private updateLobby(){
        let data = Array.from(this.clients.values())
        this.socket.emit('update_lobby_data', data, item.list)
    }

    private createNewClient(socket: any): Client{
        let client = new Client(socket.id)
        this.clients.set(socket.id, client)
        this.updateLobby()

        return client
    }

    endOfLevel(){
        this.level = undefined
        this.clients = new Map()
        this.game_started = false
        clearInterval(this.game_loop)
        this.socket.emit('game_is_over')
    }

    private initSocket(): void {
        const connection = mysql.createConnection({
            host: 'localhost',     // адрес сервера
            user: 'root',         // имя пользователя
            password: '11235813', // пароль
            database: 'game_data' // имя базы данных
        });

        connection.query('SELECT * FROM last_stage', (err, results, fields) => {
        if (err) {
            console.error('Ошибка запроса: ' + err.stack);
            return;
        }
        console.log('Результаты запроса:', results);
        });

        this.socket.on('connection', (socket: any) => {

            socket.emit('server_status', this.game_started)

            if(!this.game_started){
                
                let client = this.createNewClient(socket)

                socket.on('change_class', (class_name: string) => {
                    client.template.setTemplate(class_name)
                    this.updateLobby()                
                })

                socket.on('increase_stat', (stat: string) => {
                    client.template.increseStat(stat)
                    this.updateLobby()                
                })

                socket.on('decrease_stat', (stat: string) => {
                    client.template.decreaseStat(stat)
                    this.updateLobby()                
                })

                socket.on('pick_item', (item_name: string) => {
                    client.template.item = item_name
                    client.template.item_description = Item.list.find(elem => elem.name === item_name)?.description
                    this.updateLobby()                
                })

                socket.on('unpick_item', (item_name: string) => {
                    client.template.item = undefined
                    this.updateLobby()                
                })

                socket.on('select_skill', (skill_name: string) => {
                    let selected = client.template.abilities.find(elem => elem.name === skill_name)
                    let type = selected?.type
                    client.template.abilities.filter(elem => elem.type === type).forEach(elem => elem.selected = false)
                    if (selected) {
                        selected.selected = true;
                    }
                    this.updateLobby()                
                })

                socket.on('inputs', (inputs: any) => {               
                    client.character?.setLastInputs(inputs)
                })

                socket.on('player_ready', () => {
                    client.ready = !client.ready

                    if(this.allPlayersReady()){
                        setTimeout(() => {
                            let all_still_ready = this.allPlayersReady()
                            if(all_still_ready){
                                this.level = new Level(this.socket, this)

                                this.clients.forEach((value, key, map) => {
                                    let char = Builder.createCharacter(value, this.level)
                                    value.character = char
                                    this.level.assignPlayer(char)
                                })
                                this.game_started = true
                                this.level.start()
                                this.socket.emit('start', Array.from(this.clients.values()))
                                this.start()
                            }
                        }, 3000)
                    }

                    this.updateLobby()
                })

                socket.on('disconnect', () => {
                    console.log('player LEFT')

                    this.clients.delete(socket.id)
                    this.updateLobby()

                    if(this.clients.size === 0){
                        this.level = undefined
                        clearInterval(this.game_loop)
                        console.log('level was DELETED')
                        this.game_started = false
                    }
                })

                socket.on('action', (id) => {
                    let actor = this.level?.enemies.find(elem => {
                        return elem.id === id
                    })
                    if(!actor){
                        actor = this.level?.players.find(elem => {
                            return elem.id === id
                        })
                    }
                    if(actor){
                        actor.action = true
                    }
                })

                socket.on('set_target', (id) => {
                    client.character?.setTarget(id)
                })

                socket.on('select_upgrade', (upgrade_name) => {
                    client.character?.upgrade(upgrade_name)
                })

                socket.on('hold_grace', () => {
                    client.character?.holdGrace()
                })

                socket.on('exit_grace', () => {
                    client.character?.exitGrace()
                })
            }
        })
    }

    allPlayersReady(){
        return Array.from((this.clients.values())).every(elem => elem.ready)
    }

    public start(): void{
        this.game_loop = setInterval(()=> {
            if(!this.level) return
          
            let s = Date.now()
            this.level.tick()
            this.socket.emit('tick_data', this.level)
            if(this.level){
                this.level.collectTheDead()
                this.level.effects.length = 0
                this.level.deleted.length = 0
                this.level.sounds.length = 0
            }
           
            // console.log(s- Date.now())
        }, 30)
    }
}