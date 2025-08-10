import Player from "./Objects/src/Character"
import Projectiles from "./Objects/Projectiles/Projectiles"
import Unit from "./Objects/src/Unit"
import Effect from "./Objects/Effects/Effects"
import Impy from "./Objects/src/Enemy/Impy"
import { Flamy } from "./Objects/src/Enemy/Flamy"
import Solid from "./Objects/src/Enemy/Solid"
import Bones from "./Objects/src/Enemy/Bones"
import GraceShard from "./Objects/Effects/GraceShard"
import Func from "./Func"
import Split from "./Objects/Effects/Split"
import ChargedSphere from "./Objects/Effects/ChargedSphere"
import Grace from "./Objects/Effects/Grace"
import FlyingBones from "./Objects/src/Enemy/FlyingBones"
import Specter from "./Objects/src/Enemy/Specter"
import PileOfVeil from "./Objects/src/Piles/PileOfVeil"
import PileOfFrost from "./Objects/src/Piles/PileOfFrost"
import PileOfStorm from "./Objects/src/Piles/PileOfStorm"
import PileOfEvil from "./Objects/src/Piles/PileOfEvil"
import PileOfSummoning from "./Objects/src/Piles/PileOfSummoning"
import BannerOfArmour from "./Status/BannerOfArmour"
import Intervention from "./Objects/Effects/Intervention"
import Gifter from "./Objects/src/Enemy/Gifter"

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
        this.started = 0
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
        this.time = Date.now()

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
    
    createWave(){
        let player_in_zone = this.players.some(elem =>  elem.zone_id === 0)
        if(!player_in_zone) return

        let count = Func.random(1, 3)

        count += Math.floor(this.kill_count / 25)

        for(let i = 0; i < count; i++){

            let enemy_name = undefined

            let w = Math.random() * Level.enemy_list.reduce((acc, elem) => acc + elem.weight, 0)
            let w2 = 0;
            
            for (let item of Level.enemy_list) {
                w2 += item.weight;
                if (w <= w2) {
                    enemy_name = item.name;
                    break;
                }
            }

            if(enemy_name === undefined){
                continue
            }

            let enemy = undefined

            if(enemy_name === 'solid'){
                enemy = new Solid(this)
            }
            else if(enemy_name === 'flying bones'){
                enemy = new FlyingBones(this)
            }
            else if(enemy_name === 'bones'){
               enemy = new Bones(this)
            }
            else if(enemy_name === 'flamy'){
               enemy = new Flamy(this)
            }
            else if(enemy_name === 'specter'){
                enemy = new Specter(this)
            }
            else if(enemy_name === 'impy'){
                enemy = new Impy(this)
            }
            else if(enemy_name === 'gifter'){
                enemy = new Gifter(this)
            }
            else if(enemy_name === 'pile'){
                let variants = ['evil', 'frost', 'blind', 'shock', 'summon']
                let name = variants[Math.floor(Math.random() * variants.length)]

                switch(name){
                    case 'evil':
                        enemy = new PileOfEvil(this)
                        break;
                    case 'frost':
                         enemy = new PileOfFrost(this)
                         break;
                    case 'blind':
                         enemy = new PileOfVeil(this)
                         break;
                    case 'shock':
                        enemy =  new PileOfStorm(this)
                        break;
                    case 'shock':
                        enemy =  new PileOfSummoning(this)
                        break;
                }
            }

            if(!enemy){
                continue
            }

            while(enemy.isOutOfMap()){
                let players_in_zone = this.players.filter(elem => elem.zone_id === 0)
                let random_player = players_in_zone[Math.floor(Math.random() * players_in_zone.length)]
                let angle = Math.random() * 6.28
                let distance_x = Func.random(15, 30)
                let distance_y = Func.random(15, 30)

                enemy.setPoint(random_player.x + Math.sin(angle) * distance_x, random_player.y + Math.cos(angle) * distance_y)
            }

            if(enemy instanceof Solid && Func.chance(15)){
                let status = new BannerOfArmour(this.time, 0)
                this.setStatus(enemy, status)
            }

            this.enemies.push(enemy)
        }       
    }

    public start(){
        console.log('level was STARTED')  
        this.started = Date.now()
        this.create = setInterval(() => {
            this.createWave()
        }, this.time_between_wave_ms)
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