import Func from "../Func";
import { RingFlameProj } from "../Objects/Projectiles/RingFlame";
import Character from "../Objects/src/Character";

export default class RingFlame {

    chance: number = 5
    name: string = 'ring of flames'
    description: string = 'Creates 12 flames that spread out around you'

    constructor(){

    }

    trigger(player: Character){
        if(Func.notChance(this.chance)) return

        let count = 12
        
        let zones = 6.28 / count

        for(let i = 1; i <= count; i++){
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let a = Math.random() * (max_a - min_a) + min_a

            let l = 1 - Math.abs(0.5 * Math.cos(a))
            
            let n_x = Math.sin(a) * l * 12
            let n_y = Math.cos(a) * l * 12

            let flame = new RingFlameProj(player.level)
           
            flame.setOwner(player)
            flame.setPoint(player.x + n_x, player.y + n_y)
            flame.setAngle(a)

            player.level.projectiles.push(flame)
        }
    }
}