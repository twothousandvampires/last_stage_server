import Upgrades from '../../../Classes/Upgrades'
import Func from '../../../Func'
import Level from '../../../Level'
import Ignite from '../../../Status/Ignite'
import ShockStatus from '../../../Status/ShockStatus'
import Effect from '../../Effects/Effects'
import FlamyRing from '../../Effects/FlamyRing'
import FrostNova from '../../Effects/FrostNova'
import SmallShockNova from '../../Effects/SmallShockNova'
import Manifistation from './Manifistation'

export class MasterManifestation extends Manifistation {
    constructor(level: Level) {
        super(level)
        this.name = 'grace manifistation'
    }

    activate(): void {
        let r = Func.random(1, 3)
        let e = undefined
        let radius = 10

        radius += this.stage * 4

        let box = this.getBoxElipse()
        box.r = radius

        let targets = this.level.players.filter(
            elem => !elem.is_dead && Func.elipseCollision(elem.getBoxElipse(), box)
        )

        if (r === 1) {
            e = new FrostNova(this.level)

            targets.forEach(elem => {
                elem.setFreeze(1000 + this.stage * 500)
            })
        } else if (r === 2) {
            e = new FlamyRing(this.level)

            targets.forEach(elem => {
                let s = new Ignite(this.level.time)
                s.setDuration(3000 + this.stage * 1000)
                s.setPower(30 + this.stage * 10)

                this.level.setStatus(elem, s)
            })
        } else if (r === 3) {
            e = new SmallShockNova(this.level)

            targets.forEach(elem => {
                let s = new ShockStatus(this.level.time)
                s.setDuration(4000 + this.stage * 1000)
                s.setPower(30 + this.stage * 10)

                this.level.setStatus(elem, s)
            })
        }

        if (e instanceof Effect) {
            e.setPoint(this.x, this.y)
            this.level.addEffect(e)
        }
    }

    giveReward() {
        if (this.stage === 0) return
        if (!this.activated_by) return

        let list = Upgrades.getAllUpgrades()

        let value = this.stage * 2

        let filtered = list.filter(
            elem =>
                elem.canUse(this.activated_by) &&
                elem.cost <= value &&
                (!elem.ascend || elem.ascend <= this.activated_by.ascend_level)
        )

        let random = Func.getRandomFromArray(filtered)

        if(!random) return

        this.activated_by.removeUpgrades()
 
        random.teach(this.activated_by)
        this.level.addMessedge('you learned: ' + random.name, this.activated_by.id)
    }
}
