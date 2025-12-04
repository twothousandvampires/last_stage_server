import Func from "../Func";
import { SwirlingIceProj } from "../Objects/Projectiles/SwirlingIceProj";
import Character from "../Objects/src/Character";

export default class Hurricane {

    chance: number = 5
    name: string = 'hurricane'
    description: string = 'Creates 12 icicles'

    constructor(){

    }

    async trigger(player: Character){
        if(Func.notChance(this.chance)) return

        let count = 12
        
        for(let i = 1; i <= count; i++){
            await Func.sleep(Func.random(150, 300))

            let proj1 = new SwirlingIceProj(player.level, Func.random(3 * i, 3 * (i * 2)))
            proj1.setOwner(player)
            proj1.setAngle(Math.random() * 6.28)

            player.level.projectiles.push(proj1)
        }
    }
}