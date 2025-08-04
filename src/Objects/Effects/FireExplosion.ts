import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class FireExplosion extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'fire_explosion'
        this.light_r = 6
    }
}