import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class Armour extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'armour'
    }
}