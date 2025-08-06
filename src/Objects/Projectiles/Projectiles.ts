import Level from "../../Level";
import GameObject from "../src/GameObject";
import Unit from "../src/Unit";


export default abstract class Projectiles extends GameObject{

    angle: number | undefined
    owner: Unit | undefined
    flipped: boolean
    light_r: number
  
    constructor(level: Level){
        super(level)
        this.flipped = false
        this.light_r = 0
    }

    setAngle(angle: number){
        this.angle = angle
    }

    setOwner(owner: Unit){
        this.owner = owner
    }

    toJSON(){
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            name: this.name,
            z: this.z,
            flipped: this.flipped,
            light_r: this.light_r
        }
    }
   
    abstract impact(): void
}