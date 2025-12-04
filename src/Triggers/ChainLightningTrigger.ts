import Func from "../Func";
import { ChainLightning } from "../Objects/Projectiles/ChainLightning";
import Character from "../Objects/src/Character";

export default class ChainLightningTrigger {

    chance: number = 5
    name: string = 'chain lightning'
    description: string = 'Creates a lightning that hit enemy and jupms to another 15 times'

    constructor(){

    }

    async trigger(player: Character){
        if(Func.notChance(this.chance)) return

        let l = new ChainLightning(player.level)

        l.setOwner(player)
        l.setPoint(player.x, player.y)
        l.setAngle(Math.random() * 6.28)

        player.level.projectiles.push(l)
    }
}