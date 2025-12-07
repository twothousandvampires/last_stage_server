import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Item from './Item'

export default class SkullOfFirstWarrior extends Item implements ITrigger {
    kill_count: number
    countable: boolean
    threshold: number
    add_might: number
    cd: number = 1000
    last_trigger_time: number = 0
    chance: number = 100

    constructor() {
        super()
        this.kill_count = 0
        this.countable = true
        this.threshold = 8
        this.add_might = 8
        this.name = 'skull of first warrior'
        this.type = 3
        this.description = 'increases your might by 12 for 10 seconds after 12 kills'
    }

    getTriggerChance(): number {
        return this.chance
    }

    getSpecialForgings(): string[] {
        return ['duration']
    }

    equip(character: Character): void {
        character.triggers_on_kill.push(this)
    }

    trigger(character: Character) {
        if (!this.countable) return
        if (this.disabled) return

        this.kill_count++

        if (this.kill_count >= this.threshold) {
            character.might += this.add_might

            this.kill_count = 0
            this.countable = false

            character.newStatus({
                name: 'skull of first warrior',
                duration: 10000 + this.duration,
                desc: 'might increased',
            })

            setTimeout(() => {
                character.might -= this.add_might
                this.countable = true
            }, 10000 + this.duration)
        }
    }
}
