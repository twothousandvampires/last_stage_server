import Level from "../../Level.js";
import GameObject from "../src/GameObject.js";

export default abstract class Effect extends GameObject{
    
    owner: any
    producer: any
    
    constructor(level: Level){
        super(level)
    }

    act(time: number){

    }

    toJSON(){
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            name: this.name,
            z: this.z,
            light_r: this.light_r
        }
    }

    setOwner(owner: any){
        this.owner = owner
    }
}