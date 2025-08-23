import Func from "../../../Func";
import Level from "../../../Level";
import Bones from "../Enemy/Bones";
import Impy from "../Enemy/Impy";
import Pile from "./Pile";

export default class PileOfSummoning extends Pile{

    constructor(level: Level){
        super(level)
        this.frequency = 4000
        this.getState()
    }

    castAct(){
        if(this.action && !this.hit){
            this.hit = true

            this.level.sounds.push({
                name:'cast',
                x: this.x,
                y: this.y
            })

            let enemy = Math.random() > 0.5 ? new Impy(this.level) : new Bones(this.level)

            while(enemy.isOutOfMap()){
                    let angle = Math.random() * 6.28
                    let distance_x = Func.random(5, 10)
                    let distance_y = Func.random(5, 10)
    
                    enemy.setPoint(this.x + Math.sin(angle) * distance_x, this.y + Math.cos(angle) * distance_y)
            }
            
            this.level.enemies.push(enemy)
        }
    }
}