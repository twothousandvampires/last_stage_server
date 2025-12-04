import Character from "../Objects/src/Character";

export default class WardAfterEnlightTrigger {

    name: string = 'afterlight'
    description: string = 'You gain 5 ward'
    chance: number = 100

    trigger(player: Character){
        player.addWard(5)
    }
}