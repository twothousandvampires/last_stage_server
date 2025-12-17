import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'

export default class UnbreakableArmour implements ITrigger {

    chance: number = 100
    name: string = 'unbreakable armour'
    description: string = 'When you reach 1 life its permanently gives to you 1 armour and fortification rate up to 20'
    last_trigger_time: number = 0
    cd: number = 5000
    add:number = 0

    getTriggerChance(): number {
        return this.chance
    }

    async trigger(player: Character) {
        if(this.add >= 20) return

        player.armour_rate ++
        player.fortify ++
        this.add ++
    }
}