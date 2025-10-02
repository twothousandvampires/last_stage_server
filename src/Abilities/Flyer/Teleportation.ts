import Func from "../../Func";
import Character from "../../Objects/src/Character";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Teleportation extends FlyerAbility {
    
    static TELEPOR_START_STATE: number = 1
    static TELEPOR_OUT_STATE: number = 2
    static TELEPOR_END_STATE: number = 3

    state: number = Teleportation.TELEPOR_START_STATE

    teleport_x: number | undefined
    teleport_y: number | undefined
    protected: boolean = false
    increased_gate: boolean = false
    out_of_map_start: number = 0
    out_of_map_duration: number = 300

    constructor(owner: Flyer){
        super(owner)
        this.cd = 15000
        this.name = 'teleportation'
    }

    use(){
        this.owner.setState(this.act)
    }

    act(){
        if(!(this instanceof Character)) return
        let ability = this.utility
        if(!(ability instanceof Teleportation)) return

        this.is_attacking = true

        if(!this.pressed.over_x  || !this.pressed.over_y) return

        ability.teleport_x = Math.round(this.pressed.over_x + this.x - 40)
        ability.teleport_y = Math.round(this.pressed.over_y + this.y - 40)

        if(this.isOutOfMap(ability.teleport_x, ability.teleport_y)){
            ability.teleport_x = undefined
            ability.teleport_y = undefined
            this.is_attacking = false
            return
        }

        this.using_ability = ability

        this.state = 'teleport start'
        this.level.addSound('cast', this.x, this.y)

        if(ability.protected){
            this.can_be_damaged = false
        }

        this.action_time = this.getCastSpeed()
        this.setImpactTime(85)
        
        this.cancelAct = () => {
            this.action = false
            ability.teleport_x = undefined
            ability.teleport_y = undefined
            ability.state = Teleportation.TELEPOR_START_STATE
            this.can_be_damaged = true
            this.is_attacking = false
            ability.afterUse()
        }

        this.stateAct = (tick: number) => {
            if(this.action_is_end){
                if(ability.state === Teleportation.TELEPOR_START_STATE){
                    this.x = 666
                    this.y = 666
                    this.can_be_damaged = false
                    ability.state = Teleportation.TELEPOR_OUT_STATE
                    ability.out_of_map_start = this.level.time
                }
                else if(ability.state === Teleportation.TELEPOR_END_STATE){
                    let box = this.getBoxElipse()
                    box.r += 2
                    
                    if(ability.increased_gate){
                        box.r += 8
                    }
                    this.can_be_damaged = true

                    this.level.enemies.forEach((e) => {
                        if(!e.is_dead && Func.elipseCollision(box, e.getBoxElipse())){
                            e.takeDamage(this, {
                                explode: true
                            })
                        }
                    })
                    this.level.players.forEach((p) => {
                        if(p != this && !p.is_dead && Func.elipseCollision(box, p.getBoxElipse())){
                            p.takeDamage(this, {
                                explode: true
                            })
                        }
                    })

                    ability.state = 0
                    ability.teleport_x = undefined
                    ability.teleport_y = undefined
                    ability.used = true
                    this.addCourage()
                    this.getState()
                }
            }
            else if(ability.state === Teleportation.TELEPOR_OUT_STATE){
                if(this.level.time - ability.out_of_map_start >= ability.out_of_map_duration){
                    this.x = ability.teleport_x
                    this.y = ability.teleport_y
                    this.state = 'teleport end'
                    ability.state = Teleportation.TELEPOR_END_STATE
                    this.setImpactTime(100)
                }
            }
        }
    }
}