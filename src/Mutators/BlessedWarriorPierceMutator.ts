import Character from "../Objects/src/Character";
import { Mutator } from "./Mittor";

export default class BlessedWarriorPierceMutator extends Mutator {
    mutate(base: number,  player: Character): number {
        if(player.life_status > player.max_life){
            return base + 30
        }   
        else{
            return base
        }
    }
}