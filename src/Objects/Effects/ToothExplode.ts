import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class ToothExplode extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'tooth explode'
    }
}