import Func from "../../Func";
import Level from "../../Level";
import Effect from "./Effects";
import Grace from "./Grace";

export default class UltimatumText extends Effect{

    time: number
    pool: any
    acticated: boolean = false
    activated_players: number = 0
    failed: boolean = false
    chalange_radius: number = 25

    constructor(level: Level, public start_power: number = 0){
        super(level)
        this.name = 'teacher'
        this.time = Date.now()
        this.box_r = 2.2
        this.pool = []
        this.z = 8
    }

    explode(){     
        this.level.script.portal_is_exist = this.level.binded_effects.some(elem => elem instanceof Grace)
        
        this.level.players.forEach(elem => {
            elem.free_upgrade_count ++
        })

        if(this.level.script.portal_is_exist){
            return
        }

        let portal: Grace = new Grace(this.level, 10000)

        portal.setPoint(this.x, this.y)

        this.level.binded_effects.push(portal)
    }

    act(time: number){
        if(this.failed){
            this.level.players.forEach(elem => {
                elem.grace -= 3
                if(elem.grace < 0 ){
                    elem.grace = 0
                }
            })
            this.level.addSound('bones explode', this.x, this.y)
            this.delete()
            return
        }
        else if(time - this.time >= 20000){
            if(this.acticated){
                this.level.addSound('donate', this.x, this.y)
                this.explode()
            }
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
                if(elem.last_time_get_hit >= this.time){
                    this.failed = true
                }
                if(Func.distance(this, elem) > this.chalange_radius){
                    console.log(Func.distance(this, elem))
                    this.failed = true
                }   
            })
        }
    }
}