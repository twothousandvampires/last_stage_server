import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class FrostExplosionSmall extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'frost explosion small'
    }
}