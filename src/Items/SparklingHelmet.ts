import Func from "../Func";
import BigShockNova from "../Objects/Effects/BigShockNova";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class SparklingHelmet extends Item{
    unit: any
    last_trigger_time: any
    power: number
    time_beetween_proc: number

    constructor(){
        super()
        this.power = 0
        this.time_beetween_proc = 7000
    }
    
    equip(character: Character): void {
        character.level.setStatus(character, this)
    }

    unitDead(){
        
    }

    canBeForged(character: Character): boolean {
        return this.power < 3
    }
                
    forge(character: Character): void {
        this.power ++
        this.time_beetween_proc -= 1000       
    }

    apply(unit: any){
        this.unit = unit
        this.last_trigger_time = Date.now()
    }

    clear(){
        
    }

    update(status: any){
        
    }

    checkResist(){
        return false
    }

    isExpired(){
        return false
    }
    act(tick_time: number){
        if(tick_time - this.unit.last_skill_used_time >= this.time_beetween_proc){
            if(tick_time >= this.last_trigger_time){
                this.trigger()
                this.last_trigger_time = tick_time + this.time_beetween_proc
            }
        }
    }
    trigger(){
        let e = new BigShockNova(this.unit.level)
        e.setOwner(this.unit)
        e.setPoint(this.unit.x, this.unit.y)

        this.unit.level.effects.push(e)

        let enemies = this.unit.level.enemies
        let players = this.unit.level.players

        let targets = enemies.concat(players)
        let wave = this.unit.getBoxElipse()
        wave.r  = 20

        this.unit.level.addSound('static', this.unit.x, this.unit.y)
        let was_sound = false
        targets.forEach((elem) => {
            if(!elem.is_dead && elem.z < 1 && Func.elipseCollision(wave, elem.getBoxElipse()) && elem != this.unit){
                let timer = Func.random(100, 2000)
                elem.setZap(timer)
                if(!was_sound){
                    this.unit.level.addSound('zap', elem.x, elem.y)
                    was_sound = true
                }
            }
        })
    }
}