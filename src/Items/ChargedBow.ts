import Func from "../Func";
import { Lightning } from "../Objects/Projectiles/Lightning";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class ChargedBow extends Item{
    
    power: number
    cd: boolean

    constructor(){
        super()
        this.power = 1
        this.cd = false
    }

    canBeForged(character: Character): boolean {
        return this.power < 4
    }
    
    forge(character: Character): void {
        this.power ++
    }

    equip(character: Character): void {
        character.onHitTriggers.push(this)
    }

    trigger(character: Character, target: any){
        if(target && Func.chance(20) && !this.cd){
            this.cd = true
            setTimeout(() => {
                this.cd = false
            }, 2000)

            let count =  this.power
            
            let zones = 6.28 / count
    
            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new Lightning(character.level)
                proj.setAngle(angle)
                proj.setPoint(target.x, target.y)
    
                character.level.projectiles.push(proj)
            }
        }
    }
}