import Func from "../../Func";
import IUltimatumChallenge from "../../Interfaces/IUltimatumChallenge";
import Level from "../../Level";
import Effect from "./Effects";
import Grace from "./Grace";
import UltimatumArena from "./UltimatumArena";

export default class UltimatumText extends Effect implements IUltimatumChallenge {

    timer = Date.now()

    activated: boolean = false
    activated_players = []
    failed = false
    challenge_radius = 25
    effect: any

    constructor(level: Level){
        super(level)
        this.name = 'ultimatum1'
        this.box_r = 2.2
    }

    success(): void {
        this.level.addSound('challenge done', this.x, this.y)
        this.level.addMessedge('come and ascend.')

        this.level.script.portal_is_exist = this.level.binded_effects.some(elem => elem instanceof Grace)
        
        this.level.players.forEach(elem => {
            elem.free_upgrade_count ++
        })

        if(this.level.script.portal_is_exist){
            if(this.effect){
                this.effect.delete()
            }

            this.delete()
            return
        }

        let portal: Grace = new Grace(this.level, 20000)

        portal.setPoint(this.x, this.y)

        this.level.binded_effects.push(portal)

        if(this.effect){
            this.effect.delete()
        }

        this.delete()
    }

    fail(){
        this.level.addMessedge('failed...')
        this.level.addSound('challenge failed', this.x, this.y)

        this.level.players.forEach(elem => {
            elem.grace -= 3
            if(elem.grace < 0 ){
                elem.grace = 0
            }
        })

        if(this.effect){
            this.effect.delete()
        }

        this.delete()
    }

    activate(){
        this.level.addMessedge('do not take damage')
        this.level.addSound('challenge start', this.x, this.y)

        this.activated = true
        this.timer = this.level.time

        this.effect = new UltimatumArena(this.level)
        this.effect.setPoint(this.x, this.y)

        this.level.binded_effects.push(this.effect)
    }

    act(time: number){
        if(time - this.timer >= 20000){
            if(this.activated){
                this.success()
            }
            else{
                this.delete()
            }      
        }
        else if(!this.activated){
            this.level.players.forEach((elem) => {
                if(!this.activated_players.includes(elem.id) && Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())){
                    this.activated_players.push(elem.id)
                    if(this.activated_players.length === this.level.players.length){
                        this.activate()
                    }
                }
            })
        }
        else{
            this.level.players.forEach((elem) => {
                if((elem.last_time_get_hit >= this.timer) || (Func.distance(this, elem) > this.challenge_radius)){
                    this.fail()
                }
            })
        }
    }
}