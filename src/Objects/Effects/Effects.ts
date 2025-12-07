import Level from '../../Level'
import GameObject from '../src/GameObject'

export default abstract class Effect extends GameObject {
    owner: any
    producer: any

    constructor(level: Level) {
        super(level)
    }

    act(time: number) {
        if (!this.owner) {
            return
        }

        this.x = this.owner.x
        this.y = this.owner.y
        this.wasChanged()
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            name: this.name,
            z: this.z,
            light_r: this.light_r,
            invisible: this.invisible,
        }
    }

    setOwner(owner: any) {
        this.owner = owner
    }

    delete() {
        this.level.deleted.push(this.id)
        this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
    }
}
