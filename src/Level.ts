import Player from "./Objects/src/Character"
import Projectiles from "./Objects/Projectiles/Projectiles"
import Unit from "./Objects/src/Unit"
import Effect from "./Objects/Effects/Effects"
import GraceShard from "./Objects/Effects/GraceShard"
import Func from "./Func"
import Split from "./Objects/Effects/Split"
import ChargedSphere from "./Objects/Effects/ChargedSphere"
import Grace from "./Objects/Effects/Grace"
import Intervention from "./Objects/Effects/Intervention"
import Default from "./Scenarios/Default"
import CircleOfGhostWarriors from "./Scenarios/CircleOfGhostWarriors"

export default class Level{
    enemies: Unit[]
    players: Player[]
    projectiles: Projectiles[]
    effects: Effect[]
    bindedEffects: Effect[]
    create: any
    dead: Unit[]
    deleted: string[]
    sounds: any[]
    socket: any
    statusPull: any[]
    last_id: number
    kill_count: number
    grace_trashold: number
    time_between_wave_ms = 7500
    time: number
    started: number
    script: any
    static enemy_list = [
       {
         'name': 'impy',
         'weight': 100
       },
       {
         'name': 'bones',
         'weight': 30
       },
       {
         'name': 'flamy',
         'weight': 20
       },
       {
         'name': 'solid',
         'weight': 12
       },  
       {
         'name': 'flying bones',
         'weight': 10
       },
        {
         'name': 'pile',
         'weight': 10
       },  
        {
         'name': 'specter',
         'weight': 3
       },      
        {
         'name': 'gifter',
         'weight': 3
       },
    ]
    
    constructor(socket: any, public server: any){
        this.socket = socket
        this.enemies = []
        this.players = []
        this.projectiles = []
        this.effects = []
        this.dead = []
        this.deleted = []
        this.bindedEffects = []
        this.sounds = []
        this.statusPull = []
        this.last_id = 0
        this.kill_count = 0
        this.grace_trashold = 5
        this.script = new CircleOfGhostWarriors()
        this.time = Date.now()
        this.started = this.time
    }

    addSoundObject(sound: any){
        this.sounds.push(sound)
    }

    addSound(name: string, x: number, y:number){
        this.sounds.push({
            name: name,
            x: x,
            y: y
        })
    }

    playerDead(){
        this.players.forEach(p => {
            p.playerDead()
        })
        if(this.players.every(elem => elem.is_dead)){
            setTimeout(() => {
                this.server.endOfLevel()
            }, 3000)
            return
        }
    }

    getId(){
        return this.last_id ++
    }

    public assignPlayer(player: Player): void{
        player.startGame()
        this.players.push(player)
    }

    stop(){
        console.log('level was STOPPED')
        clearInterval(this.create)
        this.create = undefined
        this.enemies = []
        this.players = []
        this.bindedEffects = []
        this.statusPull = []
        this.projectiles.length = 0
        this.sounds.length = 0
        this.effects.length = 0
    }

    public start(){
        console.log('level was STARTED')  
        this.script.start(this)
        this.started = Date.now()
    }

    toJSON(){
        return {
            actors: [...this.players, ...this.enemies, ...this.projectiles, ...this.effects, ...this.bindedEffects],
            deleted: this.deleted,
            sounds: this.sounds,
            meta: {
                ms: this.time - this.started,       
                killed: this.kill_count
            }
        }
    }

    setStatus(unit: any, status: any, with_check: boolean = false){

        if(status.checkResist(unit)){
            return
        }
    
        if(with_check){
            let exist = this.statusPull.find(elem => elem.unit === unit && elem.name === status.name)
            if(exist){
                exist.update(status)
                return
            }
        }

        status.apply(unit)

        this.statusPull.push(status)
    }

    public tick(): void{
       
        this.time = Date.now()
        this.script.checkTime(this)

        this.players.forEach(player => {
            player.act(this.time)
        })
        this.projectiles.forEach(proj => {
            proj.act(this.time)
        })
        this.enemies.forEach(enemy => {
            enemy.act(this.time)
        })
        this.bindedEffects.forEach(effect => {
            effect.act(this.time)
        })
        this.statusPull.forEach(status => {
            if(status.isExpired(this.time)){
                status.clear()
                this.statusPull = this.statusPull.filter(elem => elem != status)
            }
            else if(status.unit && status.unit.is_dead){
                status?.unitDead()
                status.clear()
                this.statusPull = this.statusPull.filter(elem => elem != status)
            }
            else{
                status.act(this.time)
            }
        })
        // console.log(Date.now() - s)
    }

    checkGraceCreating(){
        let diff = this.grace_trashold - this.kill_count
        if(diff > 0) return

        let exist = this.bindedEffects.some(elem => elem instanceof Grace)

        if(exist){
            this.grace_trashold ++
            return
        }

        diff = Math.abs(diff)

        let chance = 20 + diff

        if(chance >= Func.random()){
            this.grace_trashold += this.grace_trashold

            let portal = new Grace(this)

            while(portal.isOutOfMap()){
                let random_player = this.players[Math.floor(Math.random() * this.players.length)]
                let angle = Math.random() * 6.28
                let distance = Func.random(15, 30)

                portal.setPoint(random_player.x + Math.sin(angle) * distance, random_player.y + Math.cos(angle) * distance)
            }

            this.bindedEffects.push(portal)
        }
    }

    collectTheDead(){
        for(let i = 0; i < this.enemies.length; i++){
            let enemy = this.enemies[i]
            if(enemy.is_corpse){
                this.kill_count ++
                this.checkGraceCreating()

                if(Func.chance(enemy.create_chance)){

                    let drop_name = undefined

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
                    if(drop_name){
                        drop_name.setPoint(enemy.x, enemy.y)
                        this.bindedEffects.push(drop_name)
                    }
                }

                let index = this.enemies.indexOf(enemy)
                this.enemies.splice(index, 1)
            }
        }
    }
}