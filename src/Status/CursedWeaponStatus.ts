import Func from '../Func'
import Character from '../Objects/src/Character'
import Status from './Status'

export default class CursedWeaponStatus extends Status {
    constructor(
        public time: number,
        public drinker: boolean = false
    ) {
        super(time)
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.attack_radius += 4
            this.unit.attack_speed -= 400

            this.unit.newStatus({
                name: 'cursed weapon',
                duration: this.duration,
                desc: 'your weapon is cursed',
            })

            if (this.drinker) {
                this.unit.vampiric_rate += 20
            }
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.attack_radius -= 4
            this.unit.attack_speed += 400
            if (!Func.chance(this.unit.getSecondResource() * 10)) {
                this.unit.chance_to_avoid_damage_state += 100
                this.unit.takePureDamage()
                this.unit.chance_to_avoid_damage_state -= 100
            }
            if (this.drinker) {
                this.unit.vampiric_rate -= 20
            }
        }
    }
}
