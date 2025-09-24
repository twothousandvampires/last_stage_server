import Character from "./Objects/src/Character"
import Projectiles from "./Objects/Projectiles/Projectiles"
import Unit from "./Objects/src/Unit"
import Effect from "./Objects/Effects/Effects"
import GraceShard from "./Objects/Effects/GraceShard"
import Func from "./Func"
import Split from "./Objects/Effects/Split"
import ChargedSphere from "./Objects/Effects/ChargedSphere"
import Intervention from "./Objects/Effects/Intervention"
import Default from "./Scenarios/Default"
import Scenario from "./Scenarios/Scenario"
import { Server, Socket } from "socket.io"
import Status from "./Status/Status"
import GameServer from "./GameServer"
import Sound from "./Types/Sound"
import { Enemy } from "./Objects/src/Enemy/Enemy"
import Learning from "./Scenarios/Learning"
import ItemDrop from "./Objects/Effects/ItemDrop"

export default class Level{
    static enemy_list = [
       {
         'name': 'impy',
         'weight': 110
       },
       {
         'name': 'bones',
         'weight': 35
       },
       {
         'name': 'flamy',
         'weight': 14
       },
       {
         'name': 'solid',
         'weight': 12
       },  
       {
         'name': 'slime',
         'weight': 20
       },
       {
         'name': 'flying bones',
         'weight': 10
       },
       {
         'name': 'ghost',
         'weight': 5
       },
        {
         'name': 'pile',
         'weight': 12
       },  
       {
         'name': 'magic slime',
         'weight': 4
       },
        {
         'name': 'specter',
         'weight': 2
       },      
        {
         'name': 'gifter',
         'weight': 3
       },
    ]

    public boss_kills_trashold: number = 300
    public enemies: (Enemy | Unit)[] = []
    public players: Character[] = []
    public projectiles: Projectiles[] = []
    public effects: Effect[] = []
    public binded_effects: Effect[] = []
    public deleted: (string | number)[] = []
    public sounds: Sound[] = []
    public socket: Server
    public last_update_time: number = 0
 
    public time: number = Date.now()
    public started: number
    public ambient_time: number = 0
    public check_grace_time: number = 0


    private game_loop: any
    public script: Scenario = new Default()
    private status_pull: Status[] = []
    private last_id: number = 0
    public kill_count: number = 0
    private grace_trashold: number = 5
    public previuos_script: Scenario | undefined 
    
    constructor(private server: GameServer){
        this.server = server
        this.socket = this.server.socket
        this.started = this.time
    }

    public endGame(): void{
        clearImmediate(this.game_loop)
        this.server.endOfLevel()
    }

    addSound(sound: Sound): void;
    addSound(sound: string, x: number, y: number): void;

    public addSound(sound: string | Sound, x?: number, y?: number): void{
        if(typeof sound === 'object'){
            this.sounds.push(sound)
        }
        else if(x && y){
            let created: Sound = {name: sound, x, y}
            this.sounds.push(created)
        }  
    }

    public playerDead(): void{
        this.players.forEach(p => p.playerDead())

        let are_all_dead: boolean = this.players.every(elem => elem.is_dead)
        if(are_all_dead){
            setTimeout(() => {
                if(this.players.length){
                    this.endGame()
                }   
            }, 3000)
        }
    }

    public getId(): number{
        return this.last_id ++
    }

    public assignPlayer(player: Character): void{
        player.startGame()
        player.setPoint(88 + this.players.length * 4, 22)
        this.players.push(player)
        player.closeUpgrades()
        player.closeSuggest()
    }

    public start(forced_scenario_name: string | undefined): void{

        if(forced_scenario_name && forced_scenario_name === 'learning'){
            this.script = new Learning()
        }

        this.script.start(this)
        this.started = Date.now()

        this.loop()
    }

    loop(){
        let time = Date.now()
        if(time - this.last_update_time >= 30){
            this.last_update_time = time
            this.tick(time)
           
            this.socket.emit('tick_data', this, Date.now())
            
            this.collectTheDead()
            this.effects.length = 0
            this.deleted.length = 0
            this.sounds.length = 0
        }
        
        this.game_loop = setImmediate(this.loop.bind(this))
    }

    public toJSON(): any{
        return {
            actors: [...this.players, ...this.enemies.filter(elem => elem.was_changed), ...this.projectiles, ...this.effects, ...this.binded_effects],
            deleted: this.deleted,
            sounds: this.sounds,
            meta: {
                ms: this.time - this.started,       
                killed: this.kill_count,
            }
        }
    }

    public setStatus(unit: Unit | Character, status: Status, with_check: boolean = false): void{
        status.setTime(this.time)
        
        let resist = status.checkResist(unit)

        if(resist){
            unit.statusWasResisted(status)
            return
        }
    
        if(with_check){
            let exist: Status | undefined = this.status_pull.find(elem => elem.unit === unit && elem.name === status.name)
            if(exist){
                exist.update(status)
            }
            else{
                status.apply(unit)
                this.status_pull.push(status)
            }
        }
        else{
            status.apply(unit)
            this.status_pull.push(status)
        } 
    }

    public setScript(script: Scenario): void{
        this.script = script
        this.script.start(this)
    }

    public tick(time: number): void{
        this.time = time
        this.script.checkTime(this)

        if(Func.chance(10) && this.time > this.ambient_time + 1500){
            this.ambient_time = this.time
            this.addSound('ambient', Func.random(20, 120), Func.random(10, 110))
        }

        this.players.forEach(player => {
            player.act(this.time)
        })
        this.projectiles.forEach(proj => {
            proj.act(this.time)
        })
        for(let i = 0; i < this.enemies.length; i ++){
            let e = this.enemies[i]
            if(e){
               e.act(this.time) 
               if(e.is_corpse){
                    this.players.forEach(elem => {
                        if(Func.distance(e, elem) <= 20){
                            elem.enemyDeadNearby(e)
                        }
                    })
               }
            }
        }
        this.binded_effects.forEach(effect => {
            effect.act(this.time)
        })
        this.status_pull.forEach(status => {
            if(status.isExpired(this.time)){
                status.clear()
                this.status_pull = this.status_pull.filter(elem => elem != status)
            }
            else if(status.unit && status.unit.is_dead){
                status?.unitDead()
                status.clear()
                this.status_pull = this.status_pull.filter(elem => elem != status)
            }
            else{
                status.act(this.time)
            }
        })
    }

    removeEnemy(enemy: Enemy | undefined){
        if(!enemy) return

        if(enemy.count_as_killed){
            this.kill_count ++
        }

        if(Func.chance(enemy.create_chance)){
            let drop_name: Effect | undefined | string = undefined

            let total_weights = enemy.getTotalWeights()
            let sum = total_weights.reduce((acc, elem) => elem[1] + acc, 0)
            let w2 = 0;
            let rnd = Math.random() * sum
            for (let item of total_weights) {
                w2 += item[1];
                if (rnd <= w2) {
                    drop_name = item[0];
                    break;
                }
            }

            if(drop_name === 'grace'){
                drop_name = new GraceShard(this)                   
            }
            else if(drop_name === 'energy'){
                drop_name = new ChargedSphere(this)
            }
            else if(drop_name === 'entity'){
                drop_name = new Split(this)
            }
            else if(drop_name === 'intervention'){
                drop_name = new Intervention(this)
            }
            else if(drop_name === 'item'){
                drop_name = new ItemDrop(this)
            }

            if(drop_name instanceof Effect){
                drop_name.setPoint(enemy.x, enemy.y)
                this.binded_effects.push(drop_name)
            }
        }

        let index = this.enemies.indexOf(enemy)
        this.enemies.splice(index, 1)
    }

    private collectTheDead(): void{
        for(let i = 0; i < this.enemies.length; i++){
            let enemy: Enemy = this.enemies[i]
            if(enemy.is_corpse){
                this.removeEnemy(enemy)
            }
        }
    }
}