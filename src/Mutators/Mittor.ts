import Character from "../Objects/src/Character";

export abstract class Mutator{
   abstract mutate(base: number, player: Character): number
}