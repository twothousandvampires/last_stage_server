import Level from "../../../Level";
import Manifistation from "./Manifistation";

export class AscentManifistation extends Manifistation {

    constructor(level: Level){
        super(level)
        this.name = 'ascent manifistation'
    }

    activate(): void {
    }

    giveReward(){
        if(this.stage === 0) return
        if(!this.activated_by) return
    }
}