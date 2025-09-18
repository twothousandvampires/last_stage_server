import Func from "../../Func";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Teleportation extends FlyerAbility{
    
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
        this.name = 'teleportaion'
    }

    canUse(){
        return !this.used
    }

    use(){
        if(this.used) return
        
        if(!this.owner.pressed.over_x  || !this.owner.pressed.over_y) return

        this.teleport_x = Math.round(this.owner.pressed.over_x + this.owner.x - 40)
        this.teleport_y = Math.round(this.owner.pressed.over_y + this.owner.y - 40)

        if(this.owner.isOutOfMap(this.teleport_x, this.teleport_y)){
            this.teleport_x = undefined
            this.teleport_y = undefined
            return
        }

        this.owner.using_ability = this
        this.owner.can_move_by_player = false

        this.owner.state = 'teleport start'
        this.owner.level.addSound('cast', this.owner.x, this.owner.y)

        this.owner.stateAct = this.act()

        if(this.protected){
            this.owner.can_be_damaged = false
        }

        this.owner.action_time = this.owner.getCastSpeed()
        this.owner.setImpactTime(85)
        
        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.can_move_by_player = true
            this.teleport_x = undefined
            this.teleport_y = undefined
            this.afterUse()
            this.state = Teleportation.TELEPOR_START_STATE
            this.owner.can_be_damaged = true
        }
    }

    act(){
        let ability = this
        let owner = this.owner

        return (tick: number) => {
            if(owner.action_is_end){
                if(ability.state === Teleportation.TELEPOR_START_STATE){
                    owner.x = 666
                    owner.y = 666
                    owner.can_be_damaged = false
                    ability.state = Teleportation.TELEPOR_OUT_STATE
                    ability.out_of_map_start = owner.level.time
                }
                else if(ability.state === Teleportation.TELEPOR_END_STATE){
                    let box = owner.getBoxElipse()
                    box.r += 2
                    
                    if(ability.increased_gate){
                        box.r += 8
                    }
                    owner.can_be_damaged = true

                    owner.level.enemies.forEach((e) => {
                        if(!e.is_dead && Func.elipseCollision(box, e.getBoxElipse())){
                            e.takeDamage(owner, {
                                explode: true
                            })
                        }
                    })
                    owner.level.players.forEach((p) => {
                        if(p != owner && !p.is_dead && Func.elipseCollision(box, p.getBoxElipse())){
                            p.takeDamage(owner, {
                                explode: true
                            })
                        }
                    })

                    ability.state = 0
                    ability.teleport_x = undefined
                    ability.teleport_y = undefined
                    ability.used = true
                    owner.addCourage()
                    owner.getState()
                }
            }
            else if(ability.state === Teleportation.TELEPOR_OUT_STATE){
                if(owner.level.time - ability.out_of_map_start >= ability.out_of_map_duration){
                    owner.x = ability.teleport_x
                    owner.y = ability.teleport_y
                    owner.state = 'teleport end'
                    ability.state = Teleportation.TELEPOR_END_STATE
                    owner.setImpactTime(100)
                }
            }
        }
    }
}