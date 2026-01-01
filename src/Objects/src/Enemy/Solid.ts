import DemonicEmpowering from '../../../EnemyAbilities/DemonicEmpowering'
import ExplodingSkulls from '../../../EnemyAbilities/ExplodingSkulls'
import Func from '../../../Func'
import Level from '../../../Level'
import SolidDeadState from '../../../State/SolidDeadState'
import Crushed from '../../../Status/Crashed'
import GroundHit from '../../Effects/GroundHit'
import Enemy from './Enemy'

export default class Solid extends Enemy {
    explode: boolean

    constructor(level: Level) {
        super(level)
        this.name = 'solid'
        this.box_r = 4
        this.move_speed = 0.15
        this.attack_radius = 6.5
        this.attack_speed = 1800
        this.explode = false
        this.spawn_time = 1200
        this.life_status = 4
        this.armour_rate = 10
        this.create_grace_chance = 50
        this.cooldown_attack = 3000
        this.create_chance = 80
        this.create_chance = 80
        this.say_z = 18
        this.gold_revard = 4
        this.create_item_chance = 2
        this.dead_time = 1200
        this.abilities = [new DemonicEmpowering(), new ExplodingSkulls()]
    }

    getDeadStateInstance() {
        return new SolidDeadState()
    }

    deadSound(): void {
        if (Func.notChance(15)) return

        this.level.sounds.push({
            x: this.x,
            y: this.y,
            name: 'solid dead',
        })
    }

    hitImpact() {
        let e = this.getBoxElipse()
        e.x = this.hit_x
        e.y = this.hit_y
        e.r = 3

        let effect = new GroundHit(this.level)
        effect.setPoint(e.x, e.y)

        this.level.effects.push(effect)

        this.level.addSound('ground hit', e.x, e.y)
        this.level.players.forEach(p => {
            if (p?.z < 5 && Func.elipseCollision(e, p?.getBoxElipse())) {
                p.takeDamage(this, {})
                if (Func.chance(50)) {
                    let s = new Crushed(this.level.time)
                    s.setDuration(6000)

                    this.level.setStatus(p, s, true)
                }
            }
        })
    }
}
