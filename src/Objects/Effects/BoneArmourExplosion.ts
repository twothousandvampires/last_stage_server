import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class BoneArmourExplosion extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'bone explosion'
    }
}