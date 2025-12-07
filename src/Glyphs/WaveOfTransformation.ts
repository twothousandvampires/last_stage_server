import Ability from '../Abilities/Ability'
import Func from '../Func'
import Gold from '../Objects/Effects/Gold'
import GoldNova from '../Objects/Effects/GoldNova'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class WaveOfTransformation extends Mastery {
    constructor() {
        super()
        this.name = 'wave of trasformation'
        this.description =
            'When the ability is activated, there is a chance to turn nearby enemies into gold.'
    }

    trigger(player: Character, ability: Ability) {
        let e = new GoldNova(player.level)
        e.setPoint(player.x, player.y)

        player.level.addEffect(e)

        player.level.enemies.forEach(elem => {
            if (
                Func.chance(15) &&
                !elem.is_dead &&
                elem.can_be_removed &&
                Func.distance(player, elem) <= 12
            ) {
                player.level.addSound('gold spending', elem.x, elem.y)
                player.addGold(1)
                let effect = new Gold(player.level)
                effect.setPoint(elem.x, elem.y)

                player.level.addEffect(effect)

                player.level.removeEnemy(elem)
            }
        })
    }
}
