import Level from "../../Level";
import Effect from "./Effects";

export default class BurningCircleEffect extends Effect{
    x: any
    y: any
  
    constructor(level: Level){
        super(level)
        this.name = 'burning circle'
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

    setOwner(unit: any){
        this.owner = unit
    }
}