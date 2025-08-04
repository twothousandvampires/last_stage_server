import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class GhostGripArea extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'ghost grip area'
    }
}