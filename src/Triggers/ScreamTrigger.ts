import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import Character from '../Objects/src/Character'

export default class ScreamTrigger implements ITrigger {
    chance: number = 80
    name: string = 'scream'
    description: string = 'Nearby enemies get damage when you speak'
    cd: number = 1000
    last_trigger_time: number = 0

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character) {
        let box = player.getBoxElipse()
        box.r = player.voice_radius

        player.level.enemies.forEach(elem => {
            if (Func.elipseCollision(box, elem.getBoxElipse())) {
                elem.takePureDamage(player, {})
            }
        })
    }
}
