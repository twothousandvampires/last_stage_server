import characterTemplate from './Classes/CharacterTemplate'
import Character from './Objects/src/Character'

export default class Client {
    ready: boolean
    template: characterTemplate
    character: Character | undefined

    constructor(public id: string) {
        this.ready = false
        this.template = new characterTemplate()
    }
}
