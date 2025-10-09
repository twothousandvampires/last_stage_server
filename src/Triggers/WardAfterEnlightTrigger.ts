import Character from "../Objects/src/Character";

export default class WardAfterEnlightTrigger {
    trigger(player: Character){
        player.addWard(5)
    }
}