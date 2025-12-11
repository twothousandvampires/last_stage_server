import Character from "../Objects/src/Character";
import { Mutator } from "./Mittor";

export default class AnnihilationMutator extends Mutator {
    mutate(base: number,  player: Character): number {
        return base + (player.resource * 2)
    }
}