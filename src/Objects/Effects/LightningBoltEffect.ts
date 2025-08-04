import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class LightningBoltEffect extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'lightning bolt'
    }
}