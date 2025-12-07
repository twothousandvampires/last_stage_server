import Ability from '../Abilities/Ability'
import Func from '../Func'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class InfernalGaze extends Mastery {
    constructor() {
        super()
        this.name = 'infernal gaze'
        this.description =
            'When the ability is activated, there is a chance to ignite all enemies in front of you.'
    }

    trigger(player: Character, ability: Ability) {
        player.level.addSound('fire explosion', player.x, player.y)
        let gaze_angle = 0
        if (player.attack_angle) {
            gaze_angle = player.attack_angle
        } else {
            gaze_angle = player.flipped ? 4.71 : 1.57
        }

        let f = player.level.enemies.filter(
            elem =>
                !elem.is_dead &&
                Func.distance(player, elem) <= 30 &&
                Func.checkAngle(player, elem, gaze_angle, 1.2)
        )

        f.forEach(elem => {
            elem.takeDamage(player, {
                burn: true,
            })
        })
    }
}
