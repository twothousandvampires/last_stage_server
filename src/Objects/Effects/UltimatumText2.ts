import Func from "../../Func";
import Level from "../../Level";
import Default from "../../Scenarios/Default";
import Effect from "./Effects";
import Heal from "./Heal";

export default class UltimatumText2 extends Effect{

    time: number
    pool: any
    acticated: boolean = false
    activated_players: number = 0
    failed: boolean = false
    chalange_radius: number = 25

    constructor(level: Level, public start_power: number = 0){
        super(level)
        this.name = 'forger'
        this.time = Date.now()
        this.box_r = 1.8
        this.pool = []
        this.z = 8
    }

    explode(){     
        let script = this.level.script
        this.level.addSound('donate', this.x, this.y)

        if(script instanceof Default){
            script.setTimes(Default.TIMES_GOOD)
        }
    }

    fail(){
        let script = this.level.script

        if(script instanceof Default){
            script.setTimes(Default.TIMES_BAD)
        }
        this.level.addSound('bones explode', this.x, this.y)
    }

    act(time: number){
        if(this.failed || time - this.time >= 20000){
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
                    }
                }
            })
        }
        else{
            this.level.players.forEach((elem) => {
                if(Func.distance(this, elem) > this.chalange_radius){
                    this.failed = true
                }   
            })
            this.level.enemies.forEach(elem => {
                if(elem.is_dead && !this.pool.includes(elem.id) && Func.distance(elem, this) <= 20){
                    this.pool.push(elem.id)
                    if(this.pool.length >= 10){
                        console.log(this.pool.length)
                        this.explode()
                        this.delete()
                    }
                    else{
                        let e = new Heal(this.level)
                        e.setPoint(elem.x, elem.y)

                        this.level.addEffect(e)
                    }
                } 
            })
        }
    }
}