import Character from "../Objects/src/Character";
import { Mutator } from "./Mittor";

export default class CourageAvoidDamage extends Mutator {
    mutate(base: number,  player: Character): number {
        let avoid = player.getSecondResource()

        return base + avoid
    }
}