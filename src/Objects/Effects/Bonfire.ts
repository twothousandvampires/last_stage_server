import Func from "../../Func";
import Level from "../../Level";
import Effect from "./Effects";

export default class Bonfire extends Effect {
    last: number
    constructor(level: Level){
        super(level)
        this.name = 'bonfire'
        this.light_r = 20
        this.last = 0
    }

    act(time: number): void {
        if(time - this.last > 150){
            this.last = time

            if(Func.chance(50)){
                if(Func.chance(50)){
                    this.light_r --
                    if(this.light_r < 18){
                        this.light_r = 18
                    }
                }
                else{
                    this.light_r ++
                    if(this.light_r > 22){
                        this.light_r = 22
                    }
                }
            }

            this.wasChanged()
        }
        
    }
}