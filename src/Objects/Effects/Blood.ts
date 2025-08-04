import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class Blood extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'blood'
    }
}