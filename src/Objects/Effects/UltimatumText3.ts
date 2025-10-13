import Func from "../../Func";
import Level from "../../Level";
import Default from "../../Scenarios/Default";
import FlyingBones from "../src/Enemy/FlyingBones";
import Solid from "../src/Enemy/Solid";
import Specter from "../src/Enemy/Specter";
import Effect from "./Effects";


export default class UltimatumText3 extends Effect{

    time: number
    pool: any
    acticated: boolean = false
    activated_players: number = 0
    failed: boolean = false
    chalange_radius: number = 25
    monster: any

    constructor(level: Level, public start_power: number = 0){
        super(level)
        this.name = 'closed gate'
        this.time = Date.now()
        this.box_r = 2.2
        this.pool = []
        this.z = 8
    }

    explode(){     
        this.level.players.forEach(elem => elem.move_speed_penalty += 200)
    }

    fail(){

    }

    act(time: number){
        if(this.failed || time - this.time >= 20000){
            this.level.addSound('bones explode', this.x, this.y)
            this.fail()
            this.delete()
            return
        }
     
        if(!this.acticated){
            this.level.players.forEach((elem) => {
                if(Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())){
                    this.activated_players ++
                    if(this.activated_players === this.level.players.length){
                        this.acticated = true
                        this.time = Date.now()
                        this.level.addSound('door open', this.x, this.y)

                        let r = Func.random(1, 3)
                        let e = undefined

                        if(r === 1){
                            e = new Solid(this.level)
                        }
                        else if(r === 2){
                            e = new FlyingBones(this.level)
                        }
                        else{
                            e = new Specter(this.level)
                        }

                        e.setPoint(this.x, this.y)
                        this.monster = e

                        if(this.level.script instanceof Default){

                            for(let i = 0; i < 3;i ++){
                                e = this.level.script.createElite(e, this.level)
                            }

                            e = this.level.script.upgradeEnemy(e)
                        }
                        
                        e.life_status += 5
                        this.level.enemies.push(e)
                    }
                }
            })
        }
        else{
            if(this.monster.is_dead){
                this.explode()
                this.delete()
                return
            }
            this.level.players.forEach((elem) => {
                if(Func.distance(this, elem) > this.chalange_radius){
                    this.failed = true
                }   
            })
        }
    }
}