import PileOfThornCast from '../../../EnemyAbilities/PileOfThornCast'
import Level from '../../../Level'
import { Bone } from '../../Projectiles/Bone'
import Pile from './Pile'

export default class PileOfThorns extends Pile {
    collection_of_bones: boolean = false
    kill_count: number
    radius: number = 12

    constructor(
        level: Level,
        private ring_of_pain: boolean = false
    ) {
        super(level)
        this.kill_count = 0
        this.duration = 14000
        this.abilities = [
            new PileOfThornCast(this, this.ring_of_pain ? 18 : 12, this.ring_of_pain ? 2500 : 3200),
        ]
    }

    afterDead(): void {
        if (this.kill_count > 0) {
            let count = this.kill_count

            let zones = 6.28 / count

            for (let i = 1; i <= count; i++) {
                let min_a = (i - 1) * zones
                let max_a = i * zones

                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new Bone(this.level)

                proj.setAngle(angle)
                proj.setPoint(this.x + Math.sin(angle) * 2, this.y + Math.cos(angle) * 2)

                this.level.projectiles.push(proj)
            }
        }
    }
}
