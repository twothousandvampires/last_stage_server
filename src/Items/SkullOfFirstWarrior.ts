import Character from "../Objects/src/Character";
import Item from "./Item";

export default class SkullOfFirstWarrior extends Item {

    kill_count: number
    countable: boolean
    threshold: number
    add_might: number

    constructor(){
        super()
        this.kill_count = 0
        this.countable = true
        this.threshold = 8
        this.add_might = 8
        this.name = 'skull of first warrior'
        this.type = 3
        this.description = 'increases your might by 10 for 10 seconds after 10 kills'
    }

    getSpecialForgings(): string[] {
        return ['duration', 'stun when hit']
    }
    
    equip(character: Character): void {
        character.triggers_on_hit.push(this)
    }

    trigger(character: Character){
        if(!this.countable) return
        if(this.disabled) return
        
        this.kill_count++
        if(this.kill_count >= this.threshold){
            character.might += this.add_might
           
            this.kill_count = 0
            this.countable = false

            character.newStatus({
                name: 'skull of first warrior',
                duration: + this.duration,
                desc: 'might increased'
            })

            setTimeout(() => {
                character.might -= this.add_might
                this.countable = true
            }, 6000 + this.duration)
        }
    }
}