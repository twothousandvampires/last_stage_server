import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class RocksFromCeil extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'rocks from ceil'
    }
}