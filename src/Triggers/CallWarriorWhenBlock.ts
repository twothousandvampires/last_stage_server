import ITrigger from '../Interfaces/ITrigger'
import WalkingGhostCultist from '../Objects/Effects/WalkingGhostCultist'
import Character from '../Objects/src/Character'

export default class CallWarriorWhenBlock implements ITrigger {
    chance: number = 50
    cd: number = 1000
    last_trigger_time: number = 0
    name: string = 'call warrior when block'
    description: string = 'When you block there is a chance to summon spirit warrior'

    getTriggerChance(player: Character): number {
        return this.chance
    }

    trigger(player: Character, target: any) {
        if (!target) return

        let ghost = new WalkingGhostCultist(player.level)
        ghost.target = target
        ghost.restless = player.third_ability.restless_warriors
        ghost.setPoint(player.x, player.y)

        player.level.binded_effects.push(ghost)
    }
}
