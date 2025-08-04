import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class CurseOfDamnedEffect extends Effect{
    x: any
    y: any
  
    constructor(level: Level){
        super(level)
        this.name = 'curse of damned'
        this.x = undefined
        this.y = undefined
    }

    act(){
        if(!this.owner){
             return
        }  
        
        this.x = this.owner.x
        this.y = this.owner.y
    }

    setOwner(character: any){
        this.owner = character
    }
}