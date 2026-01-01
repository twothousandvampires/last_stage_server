import Character from "../Objects/src/Character";
import { Mutator } from "./Mittor";

export default class GoldenChainmailMutator extends Mutator {
    mutate(base: number,  player: Character): number {
        let v = Math.round(player.gold / 10)
        if(v > 50){
            v = 50
        }
        return base + v
    }
}