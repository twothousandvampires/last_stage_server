import Func from '../Func'
import HeavenRay from '../Objects/Effects/HeavenRay'
import Status from './Status'

export default class HeavenWrathStatus extends Status {
    last_checked: number

    constructor(
        public time: number,
        private frequency = 500
    ) {
        super(time)
        this.last_checked = time
    }

    apply(unit: any) {
        this.unit = unit

        this.unit.newStatus({
            name: 'heaven wrath',
            duration: this.duration,
            desc: 'heaven wrath',
        })
    }

    clear() {}

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'heaven wrath',
            duration: this.duration,
            desc: 'heaven wrath',
        })
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += this.frequency

            if (tick_time - this.unit.last_hit_time <= 1500) {
                let targets = this.unit.level.enemies.filter(
                    elem => !elem.is_dead && Func.distance(this.unit, elem) <= 20
                )
                let random = Func.getRandomFromArray(targets)

                if (!random) return

                let box = random.getBoxElipse()
                box.r = 6

                let to_hit = this.unit.level.enemies.filter(elem =>
                    Func.elipseCollision(box, elem.getBoxElipse())
                )

                to_hit.forEach(elem => elem.takeDamage(this.unit))

                let e = new HeavenRay(this.unit.level)
                e.setPoint(random.x, random.y)

                this.unit?.level.effects.push(e)
            }
        }
    }
}
