import ITrigger from "../Interfaces/ITrigger";
import Character from "../Objects/src/Character";
import BlockChance from "../Status/BlockChance";

export default class WallOfWillTrigger implements ITrigger{

    cd: number = 1000
    last_trigger_time: number = 0
    chance: number= 40
    name: string = 'wall of will'
    description: string = 'Gives a chance to increase your block chance'

    getTriggerChance(player: Character): number {
        return this.chance
    }

    trigger(player: Character){      
        let s = new BlockChance(player.level.time)
        s.setPower(3)
        s.setDuration(8000)

        player.level.setStatus(player, s, true)   
    }
}