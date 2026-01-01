import Func from '../../Func'
import LightningBoltEffect from '../../Objects/Effects/LightningBoltEffect'
import RocksFromCeil from '../../Objects/Effects/RocksFromCeil'
import Flyer from '../../Objects/src/PlayerClasses/Flyer'
import ShockStatus from '../../Status/ShockStatus'
import FlyerAbility from './FlyerAbility'

export default class LightningBolt extends FlyerAbility {
    high_voltage: boolean = false
    storm: boolean = false
    conductivity: boolean = false

    constructor(owner: Flyer) {
        super(owner)
        this.cost = 1
        this.name = 'lightning bolt'
        this.mastery_chance = 5
    }

    createLightning(x: number, y: number) {
        let enemies = this.owner.level.enemies
        let players = this.owner.level.players

        let targets = enemies.concat(players)

        let add_r = this.conductivity ? 3 : 0

        let hiting_box = {
            x: x,
            y: y,
            r: 5 + add_r,
        }

        let high_voltage = this.high_voltage

        let max_targets = high_voltage ? 3 : 1
        let time = Date.now()

        for (let i = 0; i < targets.length; i++) {
            let elem = targets[i]
            if (elem != this.owner && Func.elipseCollision(hiting_box, elem.getBoxElipse())) {
                if (true) {
                    let status = new ShockStatus(time)
                    status.setDuration(5000)
                    status.setPower(20)

                    this.owner.level.setStatus(elem, status)
                } else if (max_targets > 0) {
                    max_targets--
                    elem.takeDamage(this.owner, {
                        burn: true,
                    })
                }
            }
        }

        let l_effect = new LightningBoltEffect(this.owner.level)
        l_effect.setPoint(x, y)

        this.owner.level.addSound('lightning bolt', x, y)
        this.owner.level.effects.push(l_effect)

        setTimeout(() => {
            let r_effect = new RocksFromCeil(this.owner.level)
            r_effect.setPoint(x, y)
            r_effect.setOwner(this)
            this.owner.level.effects.push(r_effect)
        }, 400)
    }

    async impact() {
        this.afterUse()
        if (this.owner.target) {
            let t = this.owner.level.enemies.find(elem => elem.id === this.owner.target)

            if (!t) {
                t = this.owner.level.players.find(elem => elem.id === this.owner.target)
            }

            if (t) {
                this.owner.c_x = Math.floor(t.x)
                this.owner.c_y = Math.floor(t.y)
            }
        }

        this.createLightning(this.owner.c_x, this.owner.c_y)

        if (this.storm) {
            let count = Math.floor(this.owner.getSecondResource() / 3)

            for (let i = 0; i < count; i++) {
                await Func.sleep(200)

                let distance_x = Func.random(5, 10)
                let distance_y = Func.random(5, 10)
                let angle = Math.random() * 6.28

                let x = this.owner.c_x + Math.sin(angle) * distance_x
                let y = this.owner.c_y + Math.cos(angle) * distance_y

                this.createLightning(x, y)
            }
        }
    }
}
