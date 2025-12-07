import ColdSpireFrostNova from '../../../EnemyAbilities/ColdSpireFrostNova'
import Func from '../../../Func'
import Level from '../../../Level'
import FrostExplosionMedium from '../../Effects/FrostExplosionMedium'
import FrostNova from '../../Effects/FrostNova'
import Pile from './Pile'

export default class FrostSpire extends Pile {
    constructor(level: Level) {
        super(level)
        this.life_status = 1
        this.name = 'frost spire'
        this.duration = 6000

        this.abilities = [new ColdSpireFrostNova()]
    }

    afterDead(): void {
        let effect = new FrostExplosionMedium(this.level)
        effect.setPoint(this.x, this.y)

        this.level.effects.push(effect)

        let e = this.getBoxElipse()
        e.r = 6

        this.level.enemies.forEach(elem => {
            if (Func.elipseCollision(e, elem.getBoxElipse())) {
                elem.takeDamage()
            }
        })

        this.level.players.forEach(elem => {
            if (Func.elipseCollision(e, elem.getBoxElipse())) {
                elem.takeDamage()
            }
        })
    }
}
