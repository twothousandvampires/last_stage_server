import Level from "../../Level";
import Effect from "./Effects";

export default class GhostGrip extends Effect{
    x: any
    y: any
  
    constructor(level: Level){
        super(level)
        this.name = 'ghost grip'
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