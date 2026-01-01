import Character from "../Objects/src/Character";
import { Mutator } from "./Mittor";

export default class FocusingMutator extends Mutator {
    mutate(base: number,  player: Character): number {
        return base + (player.getSecondResource() * 2)
    }
}