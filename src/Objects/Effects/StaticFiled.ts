import Func from '../../Func'
import Level from '../../Level'
import Effect from './Effects'

export default class StaticFiled extends Effect {
    time: number
    affected: any
    check_timer: number
    last_check: any
    hand_cuffing: boolean
    collapse: boolean

    constructor(level: Level) {
        super(level)
        this.name = 'static field'
        this.box_r = 8.5
        this.time = Date.now()
        this.affected = new Map()
        this.check_timer = 1000
        this.hand_cuffing = false
        this.collapse = false
    }

    act(time: number) {
        if (time - this.time >= 5000) {
            this.level.enemies.forEach(elem => {
                if (this.affected.has(elem.id)) {
                    elem.move_speed = this.affected.get(elem.id)
                    if (this.hand_cuffing) {
                        elem.attack_speed -= 2000
                    }
                    if (this.collapse && Func.chance(15)) {
                        elem.takeDamage(this.owner, {
                            instant_death: true,
                        })
                    }
                }
            })

            this.level.players.forEach(elem => {
                if (this.affected.has(elem.id)) {
                    elem.move_speed = this.affected.get(elem.id)
                    if (this.hand_cuffing) {
                        elem.attack_speed -= 2000
                    }
                    if (this.collapse && Func.chance(5)) {
                        elem.takeDamage(this.owner, {
                            instant_death: true,
                        })
                    }
                }
            })

            this.level.projectiles.forEach(elem => {
                if (this.affected.has(elem.id)) {
                    elem.move_speed = this.affected.get(elem.id)
                }
            })

            this.level.deleted.push(this.id)
            this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)

            return
        }

        if (!this.last_check || time - this.last_check >= this.check_timer) {
            this.last_check += this.check_timer

            this.level.enemies.forEach(elem => {
                if (
                    !this.affected.has(elem.id) &&
                    Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())
                ) {
                    this.affected.set(elem.id, elem.move_speed)

                    elem.move_speed = 0
                    if (this.hand_cuffing) {
                        elem.attack_speed += 2000
                    }
                }
            })

            this.level.players.forEach(elem => {
                if (
                    !this.affected.has(elem.id) &&
                    Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())
                ) {
                    this.affected.set(elem.id, elem.move_speed)
                    elem.move_speed = 0
                    if (this.hand_cuffing) {
                        elem.attack_speed += 2000
                    }
                }
            })

            this.level.projectiles.forEach(elem => {
                if (
                    !this.affected.has(elem.id) &&
                    Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())
                ) {
                    this.affected.set(elem.id, elem.move_speed)

                    elem.move_speed = 0
                }
            })
        }
    }
}
