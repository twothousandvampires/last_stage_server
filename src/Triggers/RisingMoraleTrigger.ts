import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import Character from '../Objects/src/Character'

export default class RisingMoraleTrigger implements ITrigger {
    chance: number = 20
    name: string = 'raising morale'
    description: string = 'Gives a chance to heal yourself and your allies'
    cd: number = 1000
    last_trigger_time: number = 0

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character) {
        let box = player.getBoxElipse()
        box.r = player.voice_radius

        player.level.players.forEach(elem => {
            if (Func.elipseCollision(box, elem.getBoxElipse())) {
                elem.addLife()
            }
        })
    }
}
