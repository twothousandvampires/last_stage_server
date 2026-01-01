import Character from "../Objects/src/Character";
import { Mutator } from "./Mittor";

export default class CultistWillDamageAvoid extends Mutator {
    mutate(base: number,  player: Character): number {
        let will_avoid = player.will

        if (will_avoid > 50) {
            will_avoid = 50
        }

        return base + will_avoid
    }
}