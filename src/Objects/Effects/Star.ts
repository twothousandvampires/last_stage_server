import Level from "../../Level";
import Effect from "./Effects";

export default class Star extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'star'
    }
}