import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class GroundHit extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'ground hit'
    }
}