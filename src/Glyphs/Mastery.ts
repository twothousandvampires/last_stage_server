import Ability from '../Abilities/Ability'

export default abstract class Mastery {
    name: string = 'mastery'
    description: string = ''

    toJson() {
        return {
            name: this.name,
            description: this.description,
        }
    }

    apply(ability: Ability) {
        ability.after_use_triggers.push(this)
    }
}
