import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import SpectralSword from '../../Objects/src/Summons/SpectralSword'
import SwordmanAbility from './SwordmanAbility'

export default class SpectralSwords extends SwordmanAbility {
    call: boolean = false

    constructor(owner: Swordman) {
        super(owner)
        this.name = 'spectral swords'
        this.cost = 8
        this.need_to_pay = true
        this.mastery_chance = 50
        this.cd = 8000
    }

    impact() {
        this.owner.level.sounds.push({
            name: 'holy cast',
            x: this.owner.x,
            y: this.owner.y,
        })

        let count = 5

        if (this.call) {
            count += 2
        }

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let l = 1 - Math.abs(0.5 * Math.cos(angle))

            let n_x = Math.sin(angle) * l * 5
            let n_y = Math.cos(angle) * l * 5

            let summon = new SpectralSword(
                this.owner.level,
                15000 + (this.owner.getSecondResource() * 1000),
                this.owner
            )

            if (this.call) {
                summon.move_speed += 0.1
                summon.player_check_radius += 10
                summon.attack_speed -= 100
            }
            summon.setPoint(this.owner.x + n_x, this.owner.y + n_y)

            this.owner.level.enemies.push(summon)
        }

        this.afterUse()
    }
}
