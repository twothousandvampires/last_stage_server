import Func from "../Func";
import WalkingGhostCultist from "../Objects/Effects/WalkingGhostCultist";
import Character from "../Objects/src/Character";

export default class CallWarriorWhenBlock {

    chance: number = 100
    name: string = 'call warrior when block'
    cd: number = 1000
    last_trigger_time: number = 0

    constructor(){
        
    }

    trigger(player: Character, target: any){
        if(!target) return
        if(player.level.time - this.last_trigger_time < this.cd) return
        if(Func.notChance(this.chance, player.is_lucky)) return

        this.last_trigger_time = player.level.time

        let ghost = new WalkingGhostCultist(player.level)
        ghost.target = target
        ghost.restless = player.third_ability.restless_warriors
        ghost.setPoint(player.x, player.y)

        player.level.binded_effects.push(ghost)
    }
}