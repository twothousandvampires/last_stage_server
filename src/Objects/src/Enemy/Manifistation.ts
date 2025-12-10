import EffectBuilder from '../../../Classes/EffectBuiler'
import Func from '../../../Func'
import Level from '../../../Level'
import ActivatedManifistation from '../../Effects/ActivatedManifistation'
import Effect from '../../Effects/Effects'

export default abstract class Manifistation extends Effect {
    created: number = Date.now()
    duration: number = 15000
    out_of_map: boolean = false
    stage: number = 0
    out_of_map_timer: number = 5000
    out_of_map_start: number = 0
    previous_x: number = 0
    previous_y: number = 0
    hitted_by: any
    timer: number = 500
    last_check_time: number = 0
    count: number = 0
    count_to_activate = 4
    activated_by: any
    effect: any

    constructor(level: Level) {
        super(level)
        this.box_r = 4
        this.name = 'manifistation'
    }

    abstract giveReward(): void
    abstract activate(): void

    act(time: number) {
        if (this.out_of_map) {
            if (this.level.time - this.out_of_map_start >= this.out_of_map_timer) {
                this.returnToMap()
            }
            return
        }

        let d = this.level.time - this.created

        if (d >= this.duration && !this.hitted_by) {
            this.giveReward()
            this.delete()
            if (this.effect) {
                this.effect.delete()
            }
            return
        }

        if (time - this.last_check_time >= this.timer) {
            this.last_check_time = time

            if (this.hitted_by) {
                if (!Func.elipseCollision(this.getBoxElipse(), this.hitted_by.getBoxElipse())) {
                    if (this.effect) {
                        this.effect.delete()
                    }
                    this.hitted_by = undefined
                    this.count = 0
                } else {
                    this.count++
                    if (this.count >= this.count_to_activate) {
                        this.stage++
                        if (this.stage === 5) {
                            this.giveReward()
                            this.effect.delete()
                            this.delete()

                            return
                        } else {
                            this.activated_by = this.hitted_by
                            this.activate()
                            this.count_to_activate += 2

                            this.hitted_by = undefined
                            this.count = 0
                            this.out_of_map = true
                            this.previous_x = this.x
                            this.previous_y = this.y

                            this.x = 666
                            this.y = 666
                            this.effect.delete()
                            this.out_of_map_start = time
                            this.level.addMessedge(
                                this.name + ' ' + this.stage + '/5 activated',
                                this.activated_by.id
                            )
                            this.wasChanged()
                        }
                    }
                }
            }

            if (!this.hitted_by) {
                this.level.players.forEach(elem => {
                    if (Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())) {
                        this.level.addSound('manifistation launch', this.x, this.y)
                        this.hitted_by = elem

                        this.effect = new ActivatedManifistation(this.level)

                        this.effect.setPoint(this.x, this.y)

                        this.level.binded_effects.push(this.effect)
                    }
                })
            }
        }
    }

    returnToMap() {
        this.created = this.level.time
        this.out_of_map = false

        while (this.isOutOfMap()) {
            let angle = Math.random() * 6.28

            let distance_x = Func.random(20, 45)
            let distance_y = Func.random(20, 45)

            this.x = this.previous_x + Math.sin(angle) * distance_x
            this.y = this.previous_y + Math.cos(angle) * distance_y
        }

        EffectBuilder.createGroup(this)
        this.wasChanged()
    }
}
