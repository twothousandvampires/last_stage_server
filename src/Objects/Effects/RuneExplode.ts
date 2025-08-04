import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class RuneExplode extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'rune explode'
    }
}