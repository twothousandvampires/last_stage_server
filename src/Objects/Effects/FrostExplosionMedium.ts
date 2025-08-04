import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class FrostExplosionMedium extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'frost explosion medium'
    }
}