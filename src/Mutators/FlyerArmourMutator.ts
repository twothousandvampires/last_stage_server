import Character from "../Objects/src/Character";
import { Mutator } from "./Mittor";

export default class FlyerArmourMutator extends Mutator {
    mutate(base: number,  player: Character): number {
        return base + (player.agility * 3)
    }
}