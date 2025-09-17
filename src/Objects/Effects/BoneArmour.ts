import Level from "../../Level";
import Effect from "./Effects";

export default class BoneArmour extends Effect{

    x: any
    y: any
    
    constructor(level: Level){
        super(level)
        this.name = 'bone armour'
        this.x = undefined
    }

    act(tick: number){
        if(!this.owner){
             return
        }  

        this.x = this.owner.x
        this.y = this.owner.y
    }

    setOwner(character){
        this.owner = character
    }
}