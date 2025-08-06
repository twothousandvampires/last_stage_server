import Character from "../Objects/src/Character";
import Item from "./Item";

export default class SkullOfFirstWarrior extends Item{
    kill_count: number
    countable: boolean
    threshold: number
    add_might: number
    power: number

    constructor(){
        super()
        this.kill_count = 0
        this.countable = true
        this.threshold = 8
        this.add_might = 8
        this.power = 0
    }

    canBeForged(character: Character): boolean {
        return this.power < 3
    }
    
    forge(character: Character): void {
        this.power ++
        this.threshold -= 1
        this.add_might += 1
    }
    
    equip(character: Character): void {
        character.onHitTriggers.push(this)
    }

    trigger(character: Character){
        if(!this.countable) return
       
        this.kill_count++
        if(this.kill_count >= this.threshold){
            character.might += this.add_might
           
            this.kill_count = 0
            this.countable = false

            character.newStatus({
                name: 'skull of first warrior',
                duration: 6000,
                desc: 'might increased'
            })

            setTimeout(() => {
                character.might -= this.add_might
                this.countable = true
            }, 6000)
        }
    }
}